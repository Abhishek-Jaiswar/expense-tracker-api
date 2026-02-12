CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  username character varying(100) NOT NULL,
  password character varying(100) NOT NULL,
  email character varying(100) NOT NULL,
  fullname character varying(100) NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.users
ADD CONSTRAINT users_pkey PRIMARY KEY (id)


CREATE TABLE public.expenses (
  id uuid NOT NULL DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  expense_name text NOT NULL,
  expense_amount integer NOT NULL,
  expense_description text NOT NULL,
  expense_date date NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.expenses
ADD CONSTRAINT expenses_pkey PRIMARY KEY (id)


