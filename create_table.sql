-- Create table 
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

-- Create views for Roberto's bar graph
CREATE VIEW routine_avg_score_by_neighborhood_top10_view AS
SELECT neighborhood, round(avg(inspection_score),2) as is_avg
FROM public.food_inspections
where inspection_type='Routine'
group by neighborhood
order by is_avg DESC
limit 10;

CREATE VIEW followup_avg_score_by_neighborhood_top10_view AS
SELECT neighborhood, round(avg(inspection_score),2) as is_avg
FROM public.food_inspections
where inspection_type='Follow-Up'
group by neighborhood
order by is_avg DESC
limit 10;

CREATE VIEW followup_avg_score_by_neighborhood_bottom10_view AS
SELECT neighborhood, round(avg(inspection_score),2) as is_avg
FROM public.food_inspections
where inspection_type='Follow-Up'
group by neighborhood
order by is_avg ASC
limit 10;

CREATE VIEW routine_avg_score_by_neighborhood_bottom10_view AS
SELECT neighborhood, round(avg(inspection_score),2) as is_avg
FROM public.food_inspections
where inspection_type='Routine'
group by neighborhood
order by is_avg ASC
limit 10;	
