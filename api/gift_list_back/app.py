import os
import logging

import asyncpg
from fastapi import FastAPI, Depends, HTTPException

from schemas import Gift, GiftCreate, GiftUpdate, GiftDelete, GiftSwap, AllergyPut, GiftClaimUpdate,  \
    GiftClaim

logging.basicConfig(level=logging.INFO)
app = FastAPI(docs_url="/", title="GIFT LIST API", version="v1")


class ApiPoolManager:
    def __init__(self):
        self.pool = None  # Optional[asyncpg.pool.Pool]
        self.connection_pool_created = False

    async def create_pool(self):
        db_host = os.environ["GIFT_LIST_DB_SERVICE_HOST"]
        db_port = os.environ["GIFT_LIST_DB_SERVICE_PORT"]
        db_user = os.environ["POSTGRES_USER"]
        db_pwd = os.environ["POSTGRES_PASSWORD"]
        db_name = os.environ["POSTGRES_DB"]

        logging.info("Creating connection pool")
        self.pool = await asyncpg.create_pool(
            user=db_user,
            password=db_pwd,
            host=db_host,
            port=db_port,
            database=db_name,
        )
        logging.info("Successfully created connection pool")
        self.connection_pool_created = True

    async def get_conn(self) -> asyncpg.connection.Connection:
        if not self.connection_pool_created:
            await self.create_pool()
        async with self.pool.acquire() as connection:
            yield connection


api_pool_manager = ApiPoolManager()


@app.on_event("startup")
async def startup_event():
    logging.info("Started up")


@app.on_event("shutdown")
async def shutdown_event():
    if api_pool_manager.connection_pool_created:
        logging.info("Closing connection pool")
        await api_pool_manager.pool.close()
        logging.info("Successfully closed connection pool")


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/gifts")
async def get_gifts(conn=Depends(api_pool_manager.get_conn)):
    async with conn.transaction():
        all_gifts = await conn.fetch("""
            SELECT gifts.*, COALESCE(SUM(gift_claims.claimed_amount), 0) as claimed FROM gifts
            LEFT JOIN   gift_claims ON gifts.id = gift_claims.claimed_gift_id
            GROUP BY gift_claims.claimed_gift_id, gifts.id
        """)
    return [Gift(**gift) for gift in sorted(all_gifts, key=lambda k: k['gift_order'])]


@app.post("/swap_gifts")
async def swap_gifts(gift_swap: GiftSwap, conn=Depends(api_pool_manager.get_conn)):
    logging.info(gift_swap)
    async with conn.transaction():
        await conn.execute('''
            update gifts set gift_order = (case gift_order when $1 then $2 when $2 then $1 else gift_order end);
            ''', gift_swap.newPosition, gift_swap.oldPosition)


@app.post("/gifts")
async def post_gifts(gift: GiftUpdate, conn=Depends(api_pool_manager.get_conn)):
    logging.info(gift)
    async with conn.transaction():
        await conn.execute('''
            UPDATE gifts
            SET name = $2,
                description = $3,
                urls = $4,
                image_url = $5,
                desired_amount = $6,
                gift_order = $7,
                modified_at = now()
            WHERE id = $1;
            ''', gift.id, gift.name, gift.description, gift.urls, gift.image_url, gift.desired_amount, gift.gift_order)


@app.put("/gifts")
async def put_gifts(gift: GiftCreate, conn=Depends(api_pool_manager.get_conn)):
    logging.info(gift)
    async with conn.transaction():
        await conn.execute('''
            INSERT INTO gifts(name, description, urls, image_url, desired_amount, gift_order) 
            VALUES($1, $2, $3, $4, $5, $6)
            ''', gift.name, gift.description, gift.urls, gift.image_url, gift.desired_amount, gift.gift_order)


@app.delete("/gifts")
async def delete_gifts(gift: GiftDelete, conn=Depends(api_pool_manager.get_conn)):
    async with conn.transaction():
        await conn.execute("DELETE FROM gifts WHERE id = $1", gift.id)


@app.put("/allergy")
async def put_allergy(allergy: AllergyPut, conn=Depends(api_pool_manager.get_conn)):
    async with conn.transaction():
        new_user_row = await conn.execute('''
            UPDATE users
            SET food_preference = $2,
                updated_at = now()
            WHERE email = $1;
            ''', allergy.user_email, allergy.food_preference)
        if new_user_row == 'UPDATE 0':
            raise HTTPException(404, detail="Item not found")
        logging.info(f'Successfully updated user with allergy: {allergy}')


@app.get("/gift_claim")
async def get_gift_claim(user_email: str, conn=Depends(api_pool_manager.get_conn)) -> list[GiftClaim]:
    async with conn.transaction():
        claims = await conn.fetch("""
            Select * from gift_claims Where claiming_user_id=(Select id from users where email = $1) ;
        """, user_email)
        return [GiftClaim(gift_id=c['claimed_gift_id'], amount=c['claimed_amount']) for c in claims]


@app.post("/gift_claim")
async def change_gift_claim(gift_claim: GiftClaimUpdate, conn=Depends(api_pool_manager.get_conn)):
    async with conn.transaction():
        await conn.execute("""
            INSERT INTO gift_claims (claiming_user_id, claimed_gift_id, claimed_amount)
            VALUES ((SELECT id from users where email = $1), $2, 0) ON CONFLICT DO NOTHING;
        """, gift_claim.user_email, gift_claim.gift_id)
    try:
        async with conn.transaction():
            updated_gift_claim = await conn.fetch('''
                WITH lock_parent AS (
                   SELECT gifts.id
                   FROM   gifts
                   WHERE  gifts.id = $2
                   FOR    NO KEY UPDATE
                   )
                 , total_claims AS (
                   SELECT gifts.id, gifts.desired_amount, gift_claims.claimed_gift_id, SUM(gift_claims.claimed_amount) AS total_claimed
                   FROM   gift_claims
                   JOIN   gifts ON gifts.id = gift_claims.claimed_gift_id
                   WHERE  gift_claims.claimed_gift_id = $2
                   GROUP BY gift_claims.claimed_gift_id, gifts.id
                )
                UPDATE gift_claims
                set claimed_amount = claimed_amount+$3
                FROM users
                WHERE users.email = $1 and gift_claims.claiming_user_id = users.id and gift_claims.claimed_gift_id = $2
                AND EXISTS (SELECT 1 from total_claims WHERE total_claims.desired_amount+1>(total_claims.total_claimed+$3))
                RETURNING  *;
                ''', gift_claim.user_email, gift_claim.gift_id, gift_claim.change_in_amount)
            if not updated_gift_claim:
                raise HTTPException(400, detail='Cannot add more claims')
            logging.info(f'successfully updated claim row: {dict(updated_gift_claim[0])}')
    except asyncpg.CheckViolationError as e:
        logging.info(e)
        raise HTTPException(400, detail='Cannot remove more claims') from e
