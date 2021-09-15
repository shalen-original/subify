# nodejs 8.9.0 LTS
FROM node:carbon-slim

# Add unprivileged user for app
RUN useradd --user-group --create-home --shell /bin/false app 
ENV HOME=/home/app

# Create app directory
WORKDIR $HOME/subify
COPY . $HOME/subify
RUN chown -R app:app $HOME/*

# Build and test app
USER app
RUN yarn install && yarn build && yarn test

CMD [ "yarn", "serve" ]
