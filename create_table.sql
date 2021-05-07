CREATE TABLE public.food_inspections
(
    id bigint NOT NULL,
    business_name character varying COLLATE pg_catalog."default" NOT NULL,
    address character varying COLLATE pg_catalog."default" NOT NULL,
    inspection_type character varying COLLATE pg_catalog."default" NOT NULL,
    inspection_date date NOT NULL,
    inspection_score integer NOT NULL,
    neighborhood character varying COLLATE pg_catalog."default",
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    CONSTRAINT food_inspections_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.food_inspections
    OWNER to postgres;
