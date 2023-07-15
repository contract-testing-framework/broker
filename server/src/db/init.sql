SET
  statement_timeout = 0;

SET
  lock_timeout = 0;

SET
  idle_in_transaction_session_timeout = 0;

SET
  client_encoding = 'UTF8';

SET
  standard_conforming_strings = on;

SELECT
  pg_catalog.set_config('search_path', '', false);

SET
  check_function_bodies = false;

SET
  xmloption = content;

SET
  client_min_messages = warning;

SET
  row_security = off;

SET
  default_tablespace = '';

SET
  default_table_access_method = heap;

CREATE TABLE public.comparisons (
  comparison_id integer NOT NULL,
  integration_id integer NOT NULL,
  consumer_contract_id integer NOT NULL,
  provider_spec_id integer NOT NULL,
  comparison_status character varying(20) NOT NULL,
  result jsonb,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE SEQUENCE public.comparisons_comparison_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.comparisons_comparison_id_seq OWNED BY public.comparisons.comparison_id;

CREATE TABLE public.consumer_contracts (
  consumer_contract_id integer NOT NULL,
  consumer_id integer NOT NULL,
  integration_id integer NOT NULL,
  contract jsonb NOT NULL,
  contract_format character varying(20) NOT NULL,
  contract_hash character varying(40) NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE SEQUENCE public.consumer_contracts_consumer_contract_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.consumer_contracts_consumer_contract_id_seq OWNED BY public.consumer_contracts.consumer_contract_id;

CREATE TABLE public.environments (
  environment_id integer NOT NULL,
  environment_name character varying(255) NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE SEQUENCE public.environments_environment_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.environments_environment_id_seq OWNED BY public.environments.environment_id;

CREATE TABLE public.integrations (
  integration_id integer NOT NULL,
  consumer_id integer NOT NULL,
  provider_id integer NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE SEQUENCE public.integrations_integration_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.integrations_integration_id_seq OWNED BY public.integrations.integration_id;

CREATE TABLE public.knex_migrations (
  id integer NOT NULL,
  name character varying(255),
  batch integer,
  migration_time timestamp with time zone
);

CREATE SEQUENCE public.knex_migrations_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.knex_migrations_id_seq OWNED BY public.knex_migrations.id;

CREATE TABLE public.knex_migrations_lock (
  index integer NOT NULL,
  is_locked integer
);

CREATE SEQUENCE public.knex_migrations_lock_index_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.knex_migrations_lock_index_seq OWNED BY public.knex_migrations_lock.index;

CREATE TABLE public.participant_versions (
  participant_version_id integer NOT NULL,
  participant_id integer NOT NULL,
  participant_branch character varying(255),
  participant_version character varying(255) NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE SEQUENCE public.participant_versions_participant_version_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.participant_versions_participant_version_id_seq OWNED BY public.participant_versions.participant_version_id;

CREATE TABLE public.participants (
  participant_id integer NOT NULL,
  participant_name character varying(255) NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE SEQUENCE public.participants_participant_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.participants_participant_id_seq OWNED BY public.participants.participant_id;

CREATE TABLE public.provider_specs (
  provider_spec_id integer NOT NULL,
  provider_id integer NOT NULL,
  spec jsonb NOT NULL,
  spec_format character varying(20) NOT NULL,
  spec_hash character varying(40) NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE SEQUENCE public.provider_specs_provider_spec_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.provider_specs_provider_spec_id_seq OWNED BY public.provider_specs.provider_spec_id;

CREATE TABLE public.versions_contracts (
  version_contract_id integer NOT NULL,
  consumer_version_id integer NOT NULL,
  consumer_contract_id integer NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE SEQUENCE public.versions_contracts_version_contract_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.versions_contracts_version_contract_id_seq OWNED BY public.versions_contracts.version_contract_id;

CREATE TABLE public.versions_environments (
  version_environment_id integer NOT NULL,
  participant_version_id integer NOT NULL,
  environment_id integer NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE SEQUENCE public.versions_environments_version_environment_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.versions_environments_version_environment_id_seq OWNED BY public.versions_environments.version_environment_id;

CREATE TABLE public.versions_specs (
  version_spec_id integer NOT NULL,
  provider_version_id integer NOT NULL,
  provider_spec_id integer NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE SEQUENCE public.versions_specs_version_spec_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.versions_specs_version_spec_id_seq OWNED BY public.versions_specs.version_spec_id;

CREATE TABLE public.webhook_subscriptions (
  webhook_subscription_id integer NOT NULL,
  integration_id integer NOT NULL,
  spec_publish_events boolean DEFAULT false NOT NULL,
  provider_verification_events boolean DEFAULT false NOT NULL,
  comparison_events boolean DEFAULT false NOT NULL,
  url character varying(255) NOT NULL,
  enabled boolean DEFAULT true NOT NULL,
  description character varying(255),
  headers text,
  payload text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE SEQUENCE public.webhook_subscriptions_webhook_subscription_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.webhook_subscriptions_webhook_subscription_id_seq OWNED BY public.webhook_subscriptions.webhook_subscription_id;

ALTER TABLE
  ONLY public.comparisons
ALTER COLUMN
  comparison_id
SET
  DEFAULT nextval('public.comparisons_comparison_id_seq' :: regclass);

ALTER TABLE
  ONLY public.consumer_contracts
ALTER COLUMN
  consumer_contract_id
SET
  DEFAULT nextval(
    'public.consumer_contracts_consumer_contract_id_seq' :: regclass
  );

ALTER TABLE
  ONLY public.environments
ALTER COLUMN
  environment_id
SET
  DEFAULT nextval(
    'public.environments_environment_id_seq' :: regclass
  );

ALTER TABLE
  ONLY public.integrations
ALTER COLUMN
  integration_id
SET
  DEFAULT nextval(
    'public.integrations_integration_id_seq' :: regclass
  );

ALTER TABLE
  ONLY public.knex_migrations
ALTER COLUMN
  id
SET
  DEFAULT nextval('public.knex_migrations_id_seq' :: regclass);

ALTER TABLE
  ONLY public.knex_migrations_lock
ALTER COLUMN
  index
SET
  DEFAULT nextval(
    'public.knex_migrations_lock_index_seq' :: regclass
  );

ALTER TABLE
  ONLY public.participant_versions
ALTER COLUMN
  participant_version_id
SET
  DEFAULT nextval(
    'public.participant_versions_participant_version_id_seq' :: regclass
  );

ALTER TABLE
  ONLY public.participants
ALTER COLUMN
  participant_id
SET
  DEFAULT nextval(
    'public.participants_participant_id_seq' :: regclass
  );

ALTER TABLE
  ONLY public.provider_specs
ALTER COLUMN
  provider_spec_id
SET
  DEFAULT nextval(
    'public.provider_specs_provider_spec_id_seq' :: regclass
  );

ALTER TABLE
  ONLY public.versions_contracts
ALTER COLUMN
  version_contract_id
SET
  DEFAULT nextval(
    'public.versions_contracts_version_contract_id_seq' :: regclass
  );

ALTER TABLE
  ONLY public.versions_environments
ALTER COLUMN
  version_environment_id
SET
  DEFAULT nextval(
    'public.versions_environments_version_environment_id_seq' :: regclass
  );

ALTER TABLE
  ONLY public.versions_specs
ALTER COLUMN
  version_spec_id
SET
  DEFAULT nextval(
    'public.versions_specs_version_spec_id_seq' :: regclass
  );

ALTER TABLE
  ONLY public.webhook_subscriptions
ALTER COLUMN
  webhook_subscription_id
SET
  DEFAULT nextval(
    'public.webhook_subscriptions_webhook_subscription_id_seq' :: regclass
  );

ALTER TABLE
  ONLY public.comparisons
ADD
  CONSTRAINT comparisons_pkey PRIMARY KEY (comparison_id);

ALTER TABLE
  ONLY public.consumer_contracts
ADD
  CONSTRAINT consumer_contracts_consumer_id_contract_hash_unique UNIQUE (consumer_id, contract_hash);

ALTER TABLE
  ONLY public.consumer_contracts
ADD
  CONSTRAINT consumer_contracts_pkey PRIMARY KEY (consumer_contract_id);

ALTER TABLE
  ONLY public.environments
ADD
  CONSTRAINT environments_environment_name_unique UNIQUE (environment_name);

ALTER TABLE
  ONLY public.environments
ADD
  CONSTRAINT environments_pkey PRIMARY KEY (environment_id);

ALTER TABLE
  ONLY public.integrations
ADD
  CONSTRAINT integrations_consumer_id_provider_id_unique UNIQUE (consumer_id, provider_id);

ALTER TABLE
  ONLY public.integrations
ADD
  CONSTRAINT integrations_pkey PRIMARY KEY (integration_id);

ALTER TABLE
  ONLY public.knex_migrations_lock
ADD
  CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);

ALTER TABLE
  ONLY public.knex_migrations
ADD
  CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);

ALTER TABLE
  ONLY public.participant_versions
ADD
  CONSTRAINT participant_versions_pkey PRIMARY KEY (participant_version_id);

ALTER TABLE
  ONLY public.participants
ADD
  CONSTRAINT participants_participant_name_unique UNIQUE (participant_name);

ALTER TABLE
  ONLY public.participants
ADD
  CONSTRAINT participants_pkey PRIMARY KEY (participant_id);

ALTER TABLE
  ONLY public.provider_specs
ADD
  CONSTRAINT provider_specs_pkey PRIMARY KEY (provider_spec_id);

ALTER TABLE
  ONLY public.provider_specs
ADD
  CONSTRAINT provider_specs_provider_id_spec_hash_unique UNIQUE (provider_id, spec_hash);

ALTER TABLE
  ONLY public.versions_contracts
ADD
  CONSTRAINT versions_contracts_consumer_version_id_consumer_contract_id_uni UNIQUE (consumer_version_id, consumer_contract_id);

ALTER TABLE
  ONLY public.versions_contracts
ADD
  CONSTRAINT versions_contracts_pkey PRIMARY KEY (version_contract_id);

ALTER TABLE
  ONLY public.versions_environments
ADD
  CONSTRAINT versions_environments_participant_version_id_environment_id_uni UNIQUE (participant_version_id, environment_id);

ALTER TABLE
  ONLY public.versions_environments
ADD
  CONSTRAINT versions_environments_pkey PRIMARY KEY (version_environment_id);

ALTER TABLE
  ONLY public.versions_specs
ADD
  CONSTRAINT versions_specs_pkey PRIMARY KEY (version_spec_id);

ALTER TABLE
  ONLY public.versions_specs
ADD
  CONSTRAINT versions_specs_provider_version_id_provider_spec_id_unique UNIQUE (provider_version_id, provider_spec_id);

ALTER TABLE
  ONLY public.webhook_subscriptions
ADD
  CONSTRAINT webhook_subscriptions_pkey PRIMARY KEY (webhook_subscription_id);

CREATE INDEX comparisons_consumer_contract_id_index ON public.comparisons USING btree (consumer_contract_id);

CREATE INDEX comparisons_integration_id_index ON public.comparisons USING btree (integration_id);

CREATE INDEX comparisons_provider_spec_id_index ON public.comparisons USING btree (provider_spec_id);

CREATE INDEX consumer_contracts_consumer_id_index ON public.consumer_contracts USING btree (consumer_id);

CREATE INDEX consumer_contracts_integration_id_index ON public.consumer_contracts USING btree (integration_id);

CREATE INDEX integrations_consumer_id_index ON public.integrations USING btree (consumer_id);

CREATE INDEX integrations_provider_id_index ON public.integrations USING btree (provider_id);

CREATE INDEX participant_versions_participant_id_index ON public.participant_versions USING btree (participant_id);

CREATE INDEX provider_specs_provider_id_index ON public.provider_specs USING btree (provider_id);

CREATE INDEX versions_contracts_consumer_contract_id_index ON public.versions_contracts USING btree (consumer_contract_id);

CREATE INDEX versions_contracts_consumer_version_id_index ON public.versions_contracts USING btree (consumer_version_id);

CREATE INDEX versions_environments_environment_id_index ON public.versions_environments USING btree (environment_id);

CREATE INDEX versions_environments_participant_version_id_index ON public.versions_environments USING btree (participant_version_id);

CREATE INDEX versions_specs_provider_spec_id_index ON public.versions_specs USING btree (provider_spec_id);

CREATE INDEX versions_specs_provider_version_id_index ON public.versions_specs USING btree (provider_version_id);

CREATE INDEX webhook_subscriptions_integration_id_index ON public.webhook_subscriptions USING btree (integration_id);

ALTER TABLE
  ONLY public.comparisons
ADD
  CONSTRAINT comparisons_consumer_contract_id_foreign FOREIGN KEY (consumer_contract_id) REFERENCES public.consumer_contracts(consumer_contract_id) ON DELETE CASCADE;

ALTER TABLE
  ONLY public.comparisons
ADD
  CONSTRAINT comparisons_integration_id_foreign FOREIGN KEY (integration_id) REFERENCES public.integrations(integration_id) ON DELETE CASCADE;

ALTER TABLE
  ONLY public.comparisons
ADD
  CONSTRAINT comparisons_provider_spec_id_foreign FOREIGN KEY (provider_spec_id) REFERENCES public.provider_specs(provider_spec_id) ON DELETE CASCADE;

ALTER TABLE
  ONLY public.consumer_contracts
ADD
  CONSTRAINT consumer_contracts_consumer_id_foreign FOREIGN KEY (consumer_id) REFERENCES public.participants(participant_id) ON DELETE CASCADE;

ALTER TABLE
  ONLY public.consumer_contracts
ADD
  CONSTRAINT consumer_contracts_integration_id_foreign FOREIGN KEY (integration_id) REFERENCES public.integrations(integration_id) ON DELETE CASCADE;

ALTER TABLE
  ONLY public.integrations
ADD
  CONSTRAINT integrations_consumer_id_foreign FOREIGN KEY (consumer_id) REFERENCES public.participants(participant_id) ON DELETE CASCADE;

ALTER TABLE
  ONLY public.integrations
ADD
  CONSTRAINT integrations_provider_id_foreign FOREIGN KEY (provider_id) REFERENCES public.participants(participant_id) ON DELETE CASCADE;

ALTER TABLE
  ONLY public.participant_versions
ADD
  CONSTRAINT participant_versions_participant_id_foreign FOREIGN KEY (participant_id) REFERENCES public.participants(participant_id) ON DELETE CASCADE;

ALTER TABLE
  ONLY public.provider_specs
ADD
  CONSTRAINT provider_specs_provider_id_foreign FOREIGN KEY (provider_id) REFERENCES public.participants(participant_id) ON DELETE CASCADE;

ALTER TABLE
  ONLY public.versions_contracts
ADD
  CONSTRAINT versions_contracts_consumer_contract_id_foreign FOREIGN KEY (consumer_contract_id) REFERENCES public.consumer_contracts(consumer_contract_id) ON DELETE CASCADE;

ALTER TABLE
  ONLY public.versions_contracts
ADD
  CONSTRAINT versions_contracts_consumer_version_id_foreign FOREIGN KEY (consumer_version_id) REFERENCES public.participant_versions(participant_version_id) ON DELETE CASCADE;

ALTER TABLE
  ONLY public.versions_environments
ADD
  CONSTRAINT versions_environments_environment_id_foreign FOREIGN KEY (environment_id) REFERENCES public.environments(environment_id) ON DELETE CASCADE;

ALTER TABLE
  ONLY public.versions_environments
ADD
  CONSTRAINT versions_environments_participant_version_id_foreign FOREIGN KEY (participant_version_id) REFERENCES public.participant_versions(participant_version_id) ON DELETE CASCADE;

ALTER TABLE
  ONLY public.versions_specs
ADD
  CONSTRAINT versions_specs_provider_spec_id_foreign FOREIGN KEY (provider_spec_id) REFERENCES public.provider_specs(provider_spec_id) ON DELETE CASCADE;

ALTER TABLE
  ONLY public.versions_specs
ADD
  CONSTRAINT versions_specs_provider_version_id_foreign FOREIGN KEY (provider_version_id) REFERENCES public.participant_versions(participant_version_id) ON DELETE CASCADE;

ALTER TABLE
  ONLY public.webhook_subscriptions
ADD
  CONSTRAINT webhook_subscriptions_integration_id_foreign FOREIGN KEY (integration_id) REFERENCES public.integrations(integration_id) ON DELETE CASCADE;
