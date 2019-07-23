




##
# Deployment
##

# Bring the db up to date with the latest migrations
migrate:
	yarn knex -- migrate:latest --env development

rollback:
	yarn knex -- migrate:rollback --env development

# Add seed data to the tables
# re-runs existing seeds, so don't use this in
# production!
seed:
	yarn knex -- seed:run --env development
