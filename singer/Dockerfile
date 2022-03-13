FROM python:3.7.6-stretch

RUN pip install tap-stripe singer-target-postgres

WORKDIR /code
COPY . /code

ENTRYPOINT ["/code/cmd.sh"]