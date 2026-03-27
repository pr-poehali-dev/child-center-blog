CREATE TABLE IF NOT EXISTS visit_counter (
  id SERIAL PRIMARY KEY,
  total_visits BIGINT NOT NULL DEFAULT 0
);

INSERT INTO visit_counter (total_visits) VALUES (0);
