FROM python:3.7.6-stretch

RUN apt-get update && apt-get install -y cron
RUN pip install tap-stripe singer-target-postgres

# Copy stripe-cron file to the cron.d directory
COPY stripe-cron /etc/cron.d/stripe-cron

# Give execution rights on the cron job
RUN chmod 0744 /etc/cron.d/stripe-cron

# Apply cron job
RUN crontab /etc/cron.d/stripe-cron

WORKDIR /code
COPY . /code

CMD ["cron", "-f"]