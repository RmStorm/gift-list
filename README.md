# wedding-site
A small website for a wedding! Includes a wishlist!

## Getting Started

to run the whole tech stack you first must create secrets: (second secret is optional for login made with Oauth2 and [email](https://blog.mailtrap.io/nodemailer-gmail/))

```bash
cat > ./secrets/postgres_credentials.env << 'EOF'
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
FLYWAY_USER=postgres
FLYWAY_PASSWORD=postgres
EOF

cat > ./secrets/postgres_credentials.env << 'EOF'
GOOGLE_ID=your_google_app_oauth_id
GOOGLE_SECRET=your_google_app_oauth_secret
MAIL_USER=someemail
MAIL_PASS=somepass
EOF
```
Then to actually run it:

```bash
docker-compose -f docker-compose.yml -f docker-compose-prod.yml build
docker-compose -f docker-compose.yml -f docker-compose-prod.yml up -d
```

Running like this will still break logins since the frontend config for docker-compose is configured to run on the server. Change `NEXTAUTH_URL` in `./frontend/config/localdocker.env` to the same value as `localdev`. Or just run the frontend outside docker with `npm run dev`! That's much better locally anyways for developing.