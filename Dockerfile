FROM ruby:2.3
RUN apt-get update -qq && \
    apt-get install -y build-essential libpq-dev nodejs yarn && \
    mkdir /app

WORKDIR /app
ADD . /app
RUN bundle install

EXPOSE 3000

CMD bundle exec puma --bind tcp://0.0.0.0:3000