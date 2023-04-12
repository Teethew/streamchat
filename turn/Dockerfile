FROM coturn/coturn:latest

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["--log-file=stdout" "--external-ip=$(detect-external-ip)"]