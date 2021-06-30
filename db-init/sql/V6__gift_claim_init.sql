CREATE TABLE IF NOT EXISTS gift_claims (
	claiming_user_id INT,
    claimed_gift_id INT,
	claimed_amount int NOT NULL  CHECK (claimed_amount >= 0),
    modified_at timestamptz  NOT NULL DEFAULT now(),
	PRIMARY KEY (claiming_user_id, claimed_gift_id),
	CONSTRAINT fk_user
      FOREIGN KEY(claiming_user_id)
	  REFERENCES users(id),
	CONSTRAINT fk_gift
      FOREIGN KEY(claimed_gift_id)
	  REFERENCES gifts(id)
);
