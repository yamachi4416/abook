CREATE TABLE abook (
    abook_id text NOT NULL,
    name character varying(20) NOT NULL,
    memo character varying(300) NULL,
    start_of_month_date integer NOT NULL,
    start_of_month_is_prev boolean NOT NULL,
    created_date timestamp with time zone NOT NULL,
    created_user_id text NOT NULL,
    updated_date timestamp with time zone NOT NULL,
    updated_user_id text NOT NULL,
    CONSTRAINT pk_abook PRIMARY KEY (abook_id)
);


CREATE TABLE m_user (
    id text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    created_date timestamp with time zone NOT NULL,
    created_user_id text NOT NULL,
    updated_date timestamp with time zone NOT NULL,
    updated_user_id text NOT NULL,
    CONSTRAINT pk_m_user PRIMARY KEY (id)
);


CREATE TABLE account (
    id text NOT NULL,
    abook_id text NOT NULL,
    name character varying(30) NOT NULL,
    finance_div integer NOT NULL,
    use_fee boolean NOT NULL,
    avaliable boolean NOT NULL,
    disp_order integer NOT NULL,
    color character varying(30) NOT NULL,
    usually_used_for_payment boolean NOT NULL,
    usually_used_for_receipt boolean NOT NULL,
    created_date timestamp with time zone NOT NULL,
    created_user_id text NOT NULL,
    updated_date timestamp with time zone NOT NULL,
    updated_user_id text NOT NULL,
    CONSTRAINT pk_account PRIMARY KEY (id),
    CONSTRAINT fk_account_abook_abook_id FOREIGN KEY (abook_id) REFERENCES abook (abook_id) ON DELETE CASCADE
);


CREATE TABLE abook_member (
    abook_id text NOT NULL,
    user_id text NOT NULL,
    priority integer NOT NULL,
    created_date timestamp with time zone NOT NULL,
    created_user_id text NOT NULL,
    updated_date timestamp with time zone NOT NULL,
    updated_user_id text NOT NULL,
    CONSTRAINT pk_abook_member PRIMARY KEY (abook_id, user_id),
    CONSTRAINT fk_abook_member_abook_abook_id FOREIGN KEY (abook_id) REFERENCES abook (abook_id) ON DELETE CASCADE,
    CONSTRAINT fk_abook_member_m_user_user_id FOREIGN KEY (user_id) REFERENCES m_user (id) ON DELETE CASCADE
);


CREATE TABLE journal (
    id text NOT NULL,
    abook_id text NOT NULL,
    accrual_date timestamp without time zone NOT NULL,
    journal_div integer NOT NULL,
    debit_account_id text NOT NULL,
    credit_account_id text NOT NULL,
    amount bigint NOT NULL,
    fee_account_id text NULL,
    fee_amount bigint NULL,
    memo character varying(300) NULL,
    created_date timestamp with time zone NOT NULL,
    created_user_id text NOT NULL,
    updated_date timestamp with time zone NOT NULL,
    updated_user_id text NOT NULL,
    CONSTRAINT pk_journal PRIMARY KEY (id),
    CONSTRAINT fk_journal_abook_abook_id FOREIGN KEY (abook_id) REFERENCES abook (abook_id) ON DELETE CASCADE,
    CONSTRAINT fk_journal_account_credit_account_id FOREIGN KEY (credit_account_id) REFERENCES account (id) ON DELETE CASCADE,
    CONSTRAINT fk_journal_account_debit_account_id FOREIGN KEY (debit_account_id) REFERENCES account (id) ON DELETE CASCADE,
    CONSTRAINT fk_journal_account_fee_account_id FOREIGN KEY (fee_account_id) REFERENCES account (id) ON DELETE RESTRICT
);


CREATE INDEX ix_abook_member_user_id ON abook_member (user_id);


CREATE INDEX ix_account_abook_id ON account (abook_id);


CREATE INDEX ix_journal_abook_id ON journal (abook_id);


CREATE INDEX ix_journal_accrual_date_journal_div_created_date_id ON journal (accrual_date, journal_div, created_date, id);


CREATE INDEX ix_journal_credit_account_id ON journal (credit_account_id);


CREATE INDEX ix_journal_debit_account_id ON journal (debit_account_id);


CREATE INDEX ix_journal_fee_account_id ON journal (fee_account_id);


