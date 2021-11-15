FROM python:3.7.6-stretch

RUN pip install tap-stripe singer-target-postgres

WORKDIR /code
COPY . /code

CMD tap-stripe -c /code/stripe-config.json --catalog /code/catalog.json --state /code/state.json | target-postgres -c /code/postgres-config.json >> state.json && tail -1 /code/state.json > /code/state.json.tmp && mv /code/state.json.tmp /code/state.json