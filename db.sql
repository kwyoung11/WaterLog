--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: data; Type: TABLE; Schema: public; Owner: cmsc435; Tablespace: 
--

CREATE TABLE data (
    id integer NOT NULL,
    device_id integer,
    data_type character varying,
    keys character varying[],
    "values" character varying[],
    units character varying[],
    created_at timestamp with time zone,
    collected_at timestamp with time zone
);


ALTER TABLE public.data OWNER TO cmsc435;

--
-- Name: data_id_seq; Type: SEQUENCE; Schema: public; Owner: cmsc435
--

CREATE SEQUENCE data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.data_id_seq OWNER TO cmsc435;

--
-- Name: data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cmsc435
--

ALTER SEQUENCE data_id_seq OWNED BY data.id;


--
-- Name: devices; Type: TABLE; Schema: public; Owner: cmsc435; Tablespace: 
--

CREATE TABLE devices (
    id integer NOT NULL,
    user_id integer,
    latitude character varying,
    longitude character varying,
    name character varying,
    mode character varying,
    type_of_data character varying,
    wireless_device boolean,
    keys character varying[],
    units character varying[],
    offsets real[] DEFAULT '{0,0,0,0,0}'::real[]
);


ALTER TABLE public.devices OWNER TO cmsc435;

--
-- Name: devices_id_seq; Type: SEQUENCE; Schema: public; Owner: cmsc435
--

CREATE SEQUENCE devices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.devices_id_seq OWNER TO cmsc435;

--
-- Name: devices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cmsc435
--

ALTER SEQUENCE devices_id_seq OWNED BY devices.id;


--
-- Name: invitations; Type: TABLE; Schema: public; Owner: cmsc435; Tablespace: 
--

CREATE TABLE invitations (
    id integer NOT NULL,
    user_id integer,
    token character varying,
    recipient_email character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.invitations OWNER TO cmsc435;

--
-- Name: invitations_id_seq; Type: SEQUENCE; Schema: public; Owner: cmsc435
--

CREATE SEQUENCE invitations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.invitations_id_seq OWNER TO cmsc435;

--
-- Name: invitations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cmsc435
--

ALTER SEQUENCE invitations_id_seq OWNED BY invitations.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: cmsc435; Tablespace: 
--

CREATE TABLE migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    run_on timestamp without time zone NOT NULL
);


ALTER TABLE public.migrations OWNER TO cmsc435;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: cmsc435
--

CREATE SEQUENCE migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO cmsc435;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cmsc435
--

ALTER SEQUENCE migrations_id_seq OWNED BY migrations.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: cmsc435; Tablespace: 
--

CREATE TABLE users (
    id integer NOT NULL,
    email character varying,
    password_digest character varying,
    auth_token character varying,
    salt character varying,
    password_reset_token character varying,
    password_reset_sent_at character varying,
    public_key character varying,
    private_key character varying,
    shared_private_key character varying,
    email_confirmation_token character varying,
    email_confirmed boolean DEFAULT false,
    is_admin boolean DEFAULT false,
    private_profile boolean DEFAULT false,
    invites_active boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO cmsc435;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: cmsc435
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO cmsc435;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cmsc435
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: cmsc435
--

ALTER TABLE ONLY data ALTER COLUMN id SET DEFAULT nextval('data_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: cmsc435
--

ALTER TABLE ONLY devices ALTER COLUMN id SET DEFAULT nextval('devices_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: cmsc435
--

ALTER TABLE ONLY invitations ALTER COLUMN id SET DEFAULT nextval('invitations_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: cmsc435
--

ALTER TABLE ONLY migrations ALTER COLUMN id SET DEFAULT nextval('migrations_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: cmsc435
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: data; Type: TABLE DATA; Schema: public; Owner: cmsc435
--

COPY data (id, device_id, data_type, keys, "values", units, created_at, collected_at) FROM stdin;
1	1	water	{ph,temperature}	{" 4.5",68.1}	{n/a,"deg F"}	2015-12-08 08:55:42-05	2015-12-08 08:55:42-05
2	1	water	{ph,temperature}	{" 4.5",68.3}	{n/a,"deg F"}	2015-12-08 09:11:21-05	2015-12-08 09:11:21-05
3	2	water	{temperature}	{62.0}	{F}	2015-12-08 12:43:46-05	2015-12-08 12:43:46-05
4	3	water	{temperature,pH}	{6.9,7.1}	{C,pH}	2015-12-08 12:57:47-05	2015-12-08 12:57:47-05
5	2	water	{temperature}	{61.6}	{F}	2015-12-08 12:59:37-05	2015-12-08 12:59:37-05
6	2	water	{temperature}	{56.0}	{F}	2015-12-08 13:15:28-05	2015-12-08 13:15:28-05
7	2	water	{temperature}	{60.6}	{F}	2015-12-08 13:45:45-05	2015-12-08 13:45:45-05
8	2	water	{temperature}	{56.3}	{F}	2015-12-08 14:01:35-05	2015-12-08 14:01:35-05
9	2	water	{temperature}	{56.4}	{F}	2015-12-08 14:17:24-05	2015-12-08 14:17:24-05
10	2	water	{temperature}	{56.5}	{F}	2015-12-08 14:33:14-05	2015-12-08 14:33:14-05
11	2	water	{temperature}	{56.5}	{F}	2015-12-08 14:49:05-05	2015-12-08 14:49:05-05
12	2	water	{temperature}	{56.6}	{F}	2015-12-08 15:04:56-05	2015-12-08 15:04:56-05
13	2	water	{temperature}	{56.6}	{F}	2015-12-08 15:20:46-05	2015-12-08 15:20:46-05
14	2	water	{temperature}	{56.7}	{F}	2015-12-08 15:36:37-05	2015-12-08 15:36:37-05
15	2	water	{temperature}	{56.7}	{F}	2015-12-08 15:52:27-05	2015-12-08 15:52:27-05
16	2	water	{temperature}	{56.7}	{F}	2015-12-08 16:08:18-05	2015-12-08 16:08:18-05
17	2	water	{ph,temperature}	{10.5,56.6}	{pH,F}	2015-12-08 16:24:09-05	2015-12-08 16:24:09-05
18	2	water	{ph,temperature}	{10.6,56.6}	{pH,F}	2015-12-08 16:39:59-05	2015-12-08 16:39:59-05
19	2	water	{ph,temperature}	{10.5,56.5}	{pH,F}	2015-12-08 16:55:52-05	2015-12-08 16:55:52-05
20	2	water	{ph,temperature}	{10.5,56.5}	{pH,F}	2015-12-08 17:11:44-05	2015-12-08 17:11:44-05
21	2	water	{ph,temperature}	{10.4,56.4}	{pH,F}	2015-12-08 17:27:33-05	2015-12-08 17:27:33-05
22	2	water	{ph,temperature}	{10.3,56.4}	{pH,F}	2015-12-08 17:59:59-05	2015-12-08 17:59:59-05
23	2	water	{ph,temperature}	{10.2,56.4}	{pH,F}	2015-12-08 18:15:49-05	2015-12-08 18:15:49-05
24	2	water	{ph,temperature}	{10.1,56.4}	{pH,F}	2015-12-08 18:31:40-05	2015-12-08 18:31:40-05
25	2	water	{ph,temperature}	{10.0,56.3}	{pH,F}	2015-12-08 18:47:32-05	2015-12-08 18:47:32-05
26	2	water	{ph,temperature}	{10.0,56.3}	{pH,F}	2015-12-08 19:03:23-05	2015-12-08 19:03:23-05
27	2	water	{ph,temperature}	{" 9.9",56.3}	{pH,F}	2015-12-08 19:19:14-05	2015-12-08 19:19:14-05
28	2	water	{ph,temperature}	{" 9.9",56.3}	{pH,F}	2015-12-08 19:35:04-05	2015-12-08 19:35:04-05
29	2	water	{ph,temperature}	{" 9.9",56.3}	{pH,F}	2015-12-08 19:50:55-05	2015-12-08 19:50:55-05
30	2	water	{ph,temperature}	{" 9.9",56.2}	{pH,F}	2015-12-08 20:06:46-05	2015-12-08 20:06:46-05
31	2	water	{ph,temperature}	{" 9.8",56.2}	{pH,F}	2015-12-08 20:22:36-05	2015-12-08 20:22:36-05
32	2	water	{ph,temperature}	{" 9.8",56.1}	{pH,F}	2015-12-08 20:38:26-05	2015-12-08 20:38:26-05
33	2	water	{ph,temperature}	{" 9.8",56.0}	{pH,F}	2015-12-08 21:10:55-05	2015-12-08 21:10:55-05
34	2	water	{ph,temperature}	{" 9.7",56.0}	{pH,F}	2015-12-08 21:26:46-05	2015-12-08 21:26:46-05
35	2	water	{ph,temperature}	{" 9.7",56.0}	{pH,F}	2015-12-08 21:42:37-05	2015-12-08 21:42:37-05
36	2	water	{ph,temperature}	{" 9.7",55.9}	{pH,F}	2015-12-08 21:58:28-05	2015-12-08 21:58:28-05
37	2	water	{ph,temperature}	{" 9.7",55.9}	{pH,F}	2015-12-08 22:14:18-05	2015-12-08 22:14:18-05
38	2	water	{ph,temperature}	{" 9.7",55.9}	{pH,F}	2015-12-08 22:30:08-05	2015-12-08 22:30:08-05
39	2	water	{ph,temperature}	{" 9.7",55.8}	{pH,F}	2015-12-08 22:45:58-05	2015-12-08 22:45:58-05
40	2	water	{ph,temperature}	{" 9.6",55.8}	{pH,F}	2015-12-08 23:01:49-05	2015-12-08 23:01:49-05
41	2	water	{ph,temperature}	{" 9.7",55.8}	{pH,F}	2015-12-08 23:17:40-05	2015-12-08 23:17:40-05
42	2	water	{ph,temperature}	{" 9.6",55.7}	{pH,F}	2015-12-08 23:33:30-05	2015-12-08 23:33:30-05
43	2	water	{ph,temperature}	{" 9.6",55.6}	{pH,F}	2015-12-08 23:49:21-05	2015-12-08 23:49:21-05
44	2	water	{ph,temperature}	{" 9.6",55.5}	{pH,F}	2015-12-09 00:21:47-05	2015-12-09 00:21:47-05
45	2	water	{ph,temperature}	{" 9.6",55.5}	{pH,F}	2015-12-09 00:37:37-05	2015-12-09 00:37:37-05
46	2	water	{ph,temperature}	{" 9.6",55.4}	{pH,F}	2015-12-09 00:53:28-05	2015-12-09 00:53:28-05
47	2	water	{ph,temperature}	{" 9.6",55.4}	{pH,F}	2015-12-09 01:09:18-05	2015-12-09 01:09:18-05
48	2	water	{ph,temperature}	{" 9.6",55.3}	{pH,F}	2015-12-09 01:25:09-05	2015-12-09 01:25:09-05
49	2	water	{ph,temperature}	{" 9.5",55.4}	{pH,F}	2015-12-09 01:41:00-05	2015-12-09 01:41:00-05
50	2	water	{ph,temperature}	{" 9.5",55.3}	{pH,F}	2015-12-09 01:56:51-05	2015-12-09 01:56:51-05
51	2	water	{ph,temperature}	{" 9.6",55.3}	{pH,F}	2015-12-09 02:12:41-05	2015-12-09 02:12:41-05
52	2	water	{ph,temperature}	{" 9.6",55.2}	{pH,F}	2015-12-09 02:28:32-05	2015-12-09 02:28:32-05
53	2	water	{ph,temperature}	{" 9.6",55.1}	{pH,F}	2015-12-09 02:44:22-05	2015-12-09 02:44:22-05
54	2	water	{ph,temperature}	{" 9.5",55.1}	{pH,F}	2015-12-09 03:00:13-05	2015-12-09 03:00:13-05
55	2	water	{ph,temperature}	{" 9.6",55.1}	{pH,F}	2015-12-09 03:16:03-05	2015-12-09 03:16:03-05
56	2	water	{ph,temperature}	{" 9.5",55.1}	{pH,F}	2015-12-09 03:31:54-05	2015-12-09 03:31:54-05
57	2	water	{ph,temperature}	{" 9.5",55.0}	{pH,F}	2015-12-09 03:47:45-05	2015-12-09 03:47:45-05
58	2	water	{ph,temperature}	{" 9.5",55.0}	{pH,F}	2015-12-09 04:03:36-05	2015-12-09 04:03:36-05
59	2	water	{ph,temperature}	{" 9.5",54.9}	{pH,F}	2015-12-09 04:19:27-05	2015-12-09 04:19:27-05
60	2	water	{ph,temperature}	{" 9.5",54.9}	{pH,F}	2015-12-09 04:35:18-05	2015-12-09 04:35:18-05
61	2	water	{ph,temperature}	{" 9.5",54.9}	{pH,F}	2015-12-09 04:51:08-05	2015-12-09 04:51:08-05
62	2	water	{ph,temperature}	{" 9.5",54.8}	{pH,F}	2015-12-09 05:06:59-05	2015-12-09 05:06:59-05
63	2	water	{ph,temperature}	{" 9.4",54.8}	{pH,F}	2015-12-09 05:22:50-05	2015-12-09 05:22:50-05
64	2	water	{ph,temperature}	{" 9.4",54.8}	{pH,F}	2015-12-09 05:38:40-05	2015-12-09 05:38:40-05
65	2	water	{ph,temperature}	{" 9.5",54.8}	{pH,F}	2015-12-09 05:54:31-05	2015-12-09 05:54:31-05
66	2	water	{ph,temperature}	{" 9.4",54.7}	{pH,F}	2015-12-09 06:10:22-05	2015-12-09 06:10:22-05
67	2	water	{ph,temperature}	{" 9.4",54.6}	{pH,F}	2015-12-09 06:26:12-05	2015-12-09 06:26:12-05
68	2	water	{ph,temperature}	{" 9.4",54.6}	{pH,F}	2015-12-09 06:42:03-05	2015-12-09 06:42:03-05
69	2	water	{ph,temperature}	{" 9.4",54.6}	{pH,F}	2015-12-09 06:57:54-05	2015-12-09 06:57:54-05
70	2	water	{ph,temperature}	{" 9.4",54.6}	{pH,F}	2015-12-09 07:13:45-05	2015-12-09 07:13:45-05
71	2	water	{ph,temperature}	{" 9.4",54.6}	{pH,F}	2015-12-09 07:29:36-05	2015-12-09 07:29:36-05
72	2	water	{ph,temperature}	{" 9.4",54.6}	{pH,F}	2015-12-09 07:45:26-05	2015-12-09 07:45:26-05
73	2	water	{ph,temperature}	{" 9.4",54.6}	{pH,F}	2015-12-09 08:01:16-05	2015-12-09 08:01:16-05
74	2	water	{ph,temperature}	{" 9.4",54.6}	{pH,F}	2015-12-09 08:17:07-05	2015-12-09 08:17:07-05
75	2	water	{ph,temperature}	{" 9.4",54.6}	{pH,F}	2015-12-09 08:32:58-05	2015-12-09 08:32:58-05
76	2	water	{ph,temperature}	{" 9.4",54.6}	{pH,F}	2015-12-09 08:48:48-05	2015-12-09 08:48:48-05
77	2	water	{ph,temperature}	{" 9.4",54.7}	{pH,F}	2015-12-09 09:04:39-05	2015-12-09 09:04:39-05
78	2	water	{ph,temperature}	{" 9.4",54.7}	{pH,F}	2015-12-09 09:20:30-05	2015-12-09 09:20:30-05
79	2	water	{ph,temperature}	{" 9.4",54.8}	{pH,F}	2015-12-09 09:36:20-05	2015-12-09 09:36:20-05
80	2	water	{ph,temperature}	{" 9.5",54.8}	{pH,F}	2015-12-09 09:52:10-05	2015-12-09 09:52:10-05
81	2	water	{ph,temperature}	{" 9.5",54.9}	{pH,F}	2015-12-09 10:08:01-05	2015-12-09 10:08:01-05
82	2	water	{ph,temperature}	{" 9.5",54.9}	{pH,F}	2015-12-09 10:23:52-05	2015-12-09 10:23:52-05
83	2	water	{ph,temperature}	{" 9.5",55.0}	{pH,F}	2015-12-09 10:39:43-05	2015-12-09 10:39:43-05
84	2	water	{ph,temperature}	{" 9.6",55.1}	{pH,F}	2015-12-09 10:55:33-05	2015-12-09 10:55:33-05
85	2	water	{ph,temperature}	{" 9.6",55.1}	{pH,F}	2015-12-09 11:11:23-05	2015-12-09 11:11:23-05
86	2	water	{ph,temperature}	{" 9.6",55.2}	{pH,F}	2015-12-09 11:27:13-05	2015-12-09 11:27:13-05
87	2	water	{ph,temperature}	{" 9.6",55.3}	{pH,F}	2015-12-09 11:43:02-05	2015-12-09 11:43:02-05
88	2	water	{ph,temperature}	{" 9.6",55.3}	{pH,F}	2015-12-09 11:58:52-05	2015-12-09 11:58:52-05
89	2	water	{ph,temperature}	{" 9.7",55.4}	{pH,F}	2015-12-09 12:14:42-05	2015-12-09 12:14:42-05
90	2	water	{ph,temperature}	{" 9.7",55.4}	{pH,F}	2015-12-09 12:30:33-05	2015-12-09 12:30:33-05
91	2	water	{ph,temperature}	{" 9.7",55.5}	{pH,F}	2015-12-09 12:46:23-05	2015-12-09 12:46:23-05
92	2	water	{ph,temperature}	{" 9.7",55.5}	{pH,F}	2015-12-09 13:02:13-05	2015-12-09 13:02:13-05
93	2	water	{ph,temperature}	{" 9.7",55.6}	{pH,F}	2015-12-09 13:18:04-05	2015-12-09 13:18:04-05
94	2	water	{ph,temperature}	{" 9.7",55.6}	{pH,F}	2015-12-09 13:33:54-05	2015-12-09 13:33:54-05
95	2	water	{ph,temperature}	{" 9.7",55.7}	{pH,F}	2015-12-09 13:49:44-05	2015-12-09 13:49:44-05
96	2	water	{ph,temperature}	{" 9.8",55.8}	{pH,F}	2015-12-09 14:05:35-05	2015-12-09 14:05:35-05
97	2	water	{ph,temperature}	{" 9.7",55.8}	{pH,F}	2015-12-09 14:21:26-05	2015-12-09 14:21:26-05
98	2	water	{ph,temperature}	{" 9.8",55.8}	{pH,F}	2015-12-09 14:37:16-05	2015-12-09 14:37:16-05
99	2	water	{ph,temperature}	{" 9.8",55.9}	{pH,F}	2015-12-09 14:53:06-05	2015-12-09 14:53:06-05
100	2	water	{ph,temperature}	{" 9.8",55.9}	{pH,F}	2015-12-09 15:08:56-05	2015-12-09 15:08:56-05
101	2	water	{ph,temperature}	{" 9.8",55.9}	{pH,F}	2015-12-09 15:24:47-05	2015-12-09 15:24:47-05
102	2	water	{ph,temperature}	{" 9.8",56.0}	{pH,F}	2015-12-09 15:40:37-05	2015-12-09 15:40:37-05
103	2	water	{ph,temperature}	{" 9.8",56.0}	{pH,F}	2015-12-09 15:56:27-05	2015-12-09 15:56:27-05
104	2	water	{ph,temperature}	{" 9.8",56.0}	{pH,F}	2015-12-09 16:12:17-05	2015-12-09 16:12:17-05
105	2	water	{ph,temperature}	{" 9.8",56.0}	{pH,F}	2015-12-09 16:28:07-05	2015-12-09 16:28:07-05
106	2	water	{ph,temperature}	{" 9.8",56.0}	{pH,F}	2015-12-09 16:43:57-05	2015-12-09 16:43:57-05
107	2	water	{ph,temperature}	{" 9.8",56.0}	{pH,F}	2015-12-09 16:59:47-05	2015-12-09 16:59:47-05
108	2	water	{ph,temperature}	{" 9.8",56.0}	{pH,F}	2015-12-09 17:15:37-05	2015-12-09 17:15:37-05
109	2	water	{ph,temperature}	{" 9.8",55.9}	{pH,F}	2015-12-09 17:31:27-05	2015-12-09 17:31:27-05
110	2	water	{ph,temperature}	{" 9.7",55.9}	{pH,F}	2015-12-09 17:47:18-05	2015-12-09 17:47:18-05
111	2	water	{ph,temperature}	{" 9.7",56.0}	{pH,F}	2015-12-09 18:03:09-05	2015-12-09 18:03:09-05
112	2	water	{ph,temperature}	{" 9.7",55.9}	{pH,F}	2015-12-09 18:18:59-05	2015-12-09 18:18:59-05
113	2	water	{ph,temperature}	{" 9.7",56.0}	{pH,F}	2015-12-09 18:34:49-05	2015-12-09 18:34:49-05
114	2	water	{ph,temperature}	{" 9.7",56.0}	{pH,F}	2015-12-09 18:50:39-05	2015-12-09 18:50:39-05
115	2	water	{ph,temperature}	{" 9.6",56.0}	{pH,F}	2015-12-09 19:06:29-05	2015-12-09 19:06:29-05
116	2	water	{ph,temperature}	{" 9.6",55.9}	{pH,F}	2015-12-09 19:22:18-05	2015-12-09 19:22:18-05
117	2	water	{ph,temperature}	{" 9.6",55.9}	{pH,F}	2015-12-09 19:38:08-05	2015-12-09 19:38:08-05
118	2	water	{ph,temperature}	{" 9.6",56.0}	{pH,F}	2015-12-09 19:53:58-05	2015-12-09 19:53:58-05
119	2	water	{ph,temperature}	{" 9.6",55.9}	{pH,F}	2015-12-09 20:09:48-05	2015-12-09 20:09:48-05
120	2	water	{ph,temperature}	{" 9.6",55.9}	{pH,F}	2015-12-09 20:25:38-05	2015-12-09 20:25:38-05
121	2	water	{ph,temperature}	{" 9.6",55.9}	{pH,F}	2015-12-09 20:41:29-05	2015-12-09 20:41:29-05
122	2	water	{ph,temperature}	{" 9.5",55.9}	{pH,F}	2015-12-09 20:57:19-05	2015-12-09 20:57:19-05
123	2	water	{ph,temperature}	{" 9.5",55.9}	{pH,F}	2015-12-09 21:13:10-05	2015-12-09 21:13:10-05
124	2	water	{ph,temperature}	{" 9.5",55.8}	{pH,F}	2015-12-09 21:29:01-05	2015-12-09 21:29:01-05
125	2	water	{ph,temperature}	{" 9.4",55.7}	{pH,F}	2015-12-09 22:34:35-05	2015-12-09 22:34:35-05
126	2	water	{ph,temperature}	{" 9.5",55.7}	{pH,F}	2015-12-09 22:50:25-05	2015-12-09 22:50:25-05
127	2	water	{ph,temperature}	{" 9.4",55.7}	{pH,F}	2015-12-09 23:06:15-05	2015-12-09 23:06:15-05
128	2	water	{ph,temperature}	{" 9.4",55.7}	{pH,F}	2015-12-09 23:22:06-05	2015-12-09 23:22:06-05
129	2	water	{ph,temperature}	{" 9.4",55.7}	{pH,F}	2015-12-09 23:37:56-05	2015-12-09 23:37:56-05
130	2	water	{ph,temperature}	{" 9.4",55.6}	{pH,F}	2015-12-09 23:53:46-05	2015-12-09 23:53:46-05
131	2	water	{ph,temperature}	{" 9.3",55.6}	{pH,F}	2015-12-10 00:09:36-05	2015-12-10 00:09:36-05
132	2	water	{ph,temperature}	{" 9.4",55.6}	{pH,F}	2015-12-10 00:25:26-05	2015-12-10 00:25:26-05
133	2	water	{ph,temperature}	{" 9.4",55.6}	{pH,F}	2015-12-10 00:41:16-05	2015-12-10 00:41:16-05
134	2	water	{ph,temperature}	{" 9.3",55.6}	{pH,F}	2015-12-10 00:57:05-05	2015-12-10 00:57:05-05
135	2	water	{ph,temperature}	{" 9.3",55.7}	{pH,F}	2015-12-10 01:12:58-05	2015-12-10 01:12:58-05
136	2	water	{ph,temperature}	{" 9.3",55.6}	{pH,F}	2015-12-10 01:28:48-05	2015-12-10 01:28:48-05
137	2	water	{ph,temperature}	{" 9.3",55.6}	{pH,F}	2015-12-10 01:44:39-05	2015-12-10 01:44:39-05
138	2	water	{ph,temperature}	{" 9.3",55.6}	{pH,F}	2015-12-10 02:00:30-05	2015-12-10 02:00:30-05
139	2	water	{ph,temperature}	{" 9.3",55.6}	{pH,F}	2015-12-10 02:16:21-05	2015-12-10 02:16:21-05
140	2	water	{ph,temperature}	{" 9.3",55.6}	{pH,F}	2015-12-10 02:32:11-05	2015-12-10 02:32:11-05
141	2	water	{ph,temperature}	{" 9.3",55.6}	{pH,F}	2015-12-10 02:48:01-05	2015-12-10 02:48:01-05
142	2	water	{ph,temperature}	{" 9.3",55.6}	{pH,F}	2015-12-10 03:03:51-05	2015-12-10 03:03:51-05
143	2	water	{ph,temperature}	{" 9.3",55.6}	{pH,F}	2015-12-10 03:19:41-05	2015-12-10 03:19:41-05
144	2	water	{ph,temperature}	{" 9.3",55.6}	{pH,F}	2015-12-10 03:35:31-05	2015-12-10 03:35:31-05
145	2	water	{ph,temperature}	{" 9.2",55.6}	{pH,F}	2015-12-10 03:51:21-05	2015-12-10 03:51:21-05
146	2	water	{ph,temperature}	{" 9.2",55.6}	{pH,F}	2015-12-10 04:07:18-05	2015-12-10 04:07:18-05
147	2	water	{ph,temperature}	{" 9.2",55.6}	{pH,F}	2015-12-10 04:23:02-05	2015-12-10 04:23:02-05
148	2	water	{ph,temperature}	{" 9.2",55.5}	{pH,F}	2015-12-10 04:38:52-05	2015-12-10 04:38:52-05
149	2	water	{ph,temperature}	{" 9.2",55.5}	{pH,F}	2015-12-10 04:54:42-05	2015-12-10 04:54:42-05
150	2	water	{ph,temperature}	{" 9.2",55.5}	{pH,F}	2015-12-10 05:10:32-05	2015-12-10 05:10:32-05
151	2	water	{ph,temperature}	{" 9.2",55.4}	{pH,F}	2015-12-10 05:26:22-05	2015-12-10 05:26:22-05
152	2	water	{ph,temperature}	{" 9.2",55.4}	{pH,F}	2015-12-10 05:42:12-05	2015-12-10 05:42:12-05
153	2	water	{ph,temperature}	{" 9.2",55.4}	{pH,F}	2015-12-10 05:58:02-05	2015-12-10 05:58:02-05
154	2	water	{ph,temperature}	{" 9.1",55.4}	{pH,F}	2015-12-10 06:13:52-05	2015-12-10 06:13:52-05
155	2	water	{ph,temperature}	{" 9.1",55.4}	{pH,F}	2015-12-10 06:29:42-05	2015-12-10 06:29:42-05
156	2	water	{ph,temperature}	{" 9.1",55.4}	{pH,F}	2015-12-10 06:45:33-05	2015-12-10 06:45:33-05
157	2	water	{ph,temperature}	{" 9.1",55.3}	{pH,F}	2015-12-10 07:01:23-05	2015-12-10 07:01:23-05
158	2	water	{ph,temperature}	{" 9.1",55.3}	{pH,F}	2015-12-10 07:17:14-05	2015-12-10 07:17:14-05
159	2	water	{ph,temperature}	{" 9.1",55.3}	{pH,F}	2015-12-10 07:33:04-05	2015-12-10 07:33:04-05
160	2	water	{ph,temperature}	{" 9.1",55.3}	{pH,F}	2015-12-10 07:48:54-05	2015-12-10 07:48:54-05
161	2	water	{ph,temperature}	{" 9.1",55.3}	{pH,F}	2015-12-10 08:04:44-05	2015-12-10 08:04:44-05
162	2	water	{ph,temperature}	{" 9.1",55.3}	{pH,F}	2015-12-10 08:20:34-05	2015-12-10 08:20:34-05
163	2	water	{ph,temperature}	{" 9.1",55.3}	{pH,F}	2015-12-10 08:36:24-05	2015-12-10 08:36:24-05
164	2	water	{ph,temperature}	{" 9.1",55.3}	{pH,F}	2015-12-10 08:52:14-05	2015-12-10 08:52:14-05
165	2	water	{ph,temperature}	{" 9.1",55.3}	{pH,F}	2015-12-10 09:08:03-05	2015-12-10 09:08:03-05
166	2	water	{ph,temperature}	{" 9.1",55.3}	{pH,F}	2015-12-10 09:23:54-05	2015-12-10 09:23:54-05
167	2	water	{ph,temperature}	{" 9.0",55.3}	{pH,F}	2015-12-10 09:39:44-05	2015-12-10 09:39:44-05
168	2	water	{ph,temperature}	{" 9.0",55.4}	{pH,F}	2015-12-10 09:55:34-05	2015-12-10 09:55:34-05
169	2	water	{ph,temperature}	{" 8.9",55.4}	{pH,F}	2015-12-10 10:11:24-05	2015-12-10 10:11:24-05
170	2	water	{ph,temperature}	{" 8.9",55.5}	{pH,F}	2015-12-10 10:27:14-05	2015-12-10 10:27:14-05
171	2	water	{ph,temperature}	{" 8.8",55.6}	{pH,F}	2015-12-10 10:43:03-05	2015-12-10 10:43:03-05
172	2	water	{ph,temperature}	{" 8.7",55.7}	{pH,F}	2015-12-10 10:58:53-05	2015-12-10 10:58:53-05
173	2	water	{ph,temperature}	{" 8.6",55.8}	{pH,F}	2015-12-10 11:14:44-05	2015-12-10 11:14:44-05
174	2	water	{ph,temperature}	{" 8.6",55.9}	{pH,F}	2015-12-10 11:30:33-05	2015-12-10 11:30:33-05
175	2	water	{ph,temperature}	{" 8.6",56.1}	{pH,F}	2015-12-10 11:46:23-05	2015-12-10 11:46:23-05
176	2	water	{ph,temperature}	{" 8.7",56.3}	{pH,F}	2015-12-10 12:02:13-05	2015-12-10 12:02:13-05
\.


--
-- Name: data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cmsc435
--

SELECT pg_catalog.setval('data_id_seq', 176, true);


--
-- Data for Name: devices; Type: TABLE DATA; Schema: public; Owner: cmsc435
--

COPY devices (id, user_id, latitude, longitude, name, mode, type_of_data, wireless_device, keys, units, offsets) FROM stdin;
1	1	1234	1234	seeeduino stalker	Arduino	water	t	{ph,temperature}	{n/a,"deg F"}	{0,0,0,0,0}
3	2	38.96	-76.926	Riverdale_mobile	Manual	water	f	{temperature,pH}	{C,pH}	{0,0,0,0,0}
4	2	38.9	-76.92	Riverdale_SDupload	Arduino	water	f	{temperature,pH}	{F,pH}	{0,0,0,0,0}
2	2	38.96	-76.926	Riverdale	Arduino	water	t	{temperature,ph}	{F,pH}	{-11.1999998,-3.29999995,0,0,0}
5	1	1234	1234	test bulk upload	Arduino	water	f	{ph,temperature}	{n/a,n/a}	{0,0,0,0,0}
\.


--
-- Name: devices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cmsc435
--

SELECT pg_catalog.setval('devices_id_seq', 5, true);


--
-- Data for Name: invitations; Type: TABLE DATA; Schema: public; Owner: cmsc435
--

COPY invitations (id, user_id, token, recipient_email, created_at, updated_at) FROM stdin;
\.


--
-- Name: invitations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cmsc435
--

SELECT pg_catalog.setval('invitations_id_seq', 1, false);


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: cmsc435
--

COPY migrations (id, name, run_on) FROM stdin;
19	/20151028060347-Users	2015-12-08 08:51:23.196
20	/20151028060355-Devices	2015-12-08 08:51:23.255
21	/20151028060400-Data	2015-12-08 08:51:23.27
22	/20151113075658-addEmailConfirmationToUsers	2015-12-08 08:51:23.283
23	/20151113193620-addPrivacyFieldsToUsers	2015-12-08 08:51:23.321
24	/20151117204128-createServerAdministrator	2015-12-08 08:51:26.457
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cmsc435
--

SELECT pg_catalog.setval('migrations_id_seq', 24, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: cmsc435
--

COPY users (id, email, password_digest, auth_token, salt, password_reset_token, password_reset_sent_at, public_key, private_key, shared_private_key, email_confirmation_token, email_confirmed, is_admin, private_profile, invites_active) FROM stdin;
1	admin@admin.com	$2a$10$hMi/gqUTJcJrE.L3Qblv6eLdkAF/SW/FEvGbcIgaab9e9Pr.uXb72	f5f55c47705a599f9be48ebc05bc735f86f1f2f5c5be06afc56d8ca80b8a0c5b882ab6c3ca4d5adcb8d05dc23e86f6a384841ff0ce8a7c6275da282c5eb8b715	$2a$10$hMi/gqUTJcJrE.L3Qblv6e	\N	\N	-----BEGIN RSA PUBLIC KEY-----\nMBgCEQCgkrM+bsZN/2yEflSQYYXrAgMBAAE=\n-----END RSA PUBLIC KEY-----\n	-----BEGIN RSA PRIVATE KEY-----\nMGECAQACEQCgkrM+bsZN/2yEflSQYYXrAgMBAAECEATZSTZaa/yQ7LHWizLO8wECCQDb/5wV\nPz0KawIJALrZlSUkG1KBAggpRqP6OIszUQIIaudCJdXarAECCBBCVBKmk9ye\n-----END RSA PRIVATE KEY-----\n	-----BEGIN RSA PRIVATE KEY-----\nMGMCAQACEQDHaSkijNCdf0rSuXj6tbX/AgMBAAECEC1FBF+hlCKMwq/jPBU2HHECCQDo0J+3\n6K1uRQIJANtE7rQoZclzAghIdW3QQkV/9QIJALFtcxaXBd5fAgkA2x06JmrChDM=\n-----END RSA PRIVATE KEY-----\n	0ed14a456687b415fa0b05cd75713f798ae9de762ece393c91d48225e86ef45b0284438891bdbf8b087e6c1b0dbd33137d51bca7c6e871e448868a224576a801	f	t	\N	\N
2	aarmstr1@umd.edu	$2a$10$ACAdhyqXb8yR6DAGZPhFa.Np6kxoRNeI0cGaYVCeMascQxwTL/j6C	35be634e70a2b362fda319a013cb8b11dd224daf722daded92250fd2c0287158e2f7537bc2c6c77bb1215671f0ae4cdfaf8f6a488cd1f5e11c37155a90671631	$2a$10$ACAdhyqXb8yR6DAGZPhFa.	\N	\N	-----BEGIN RSA PUBLIC KEY-----\nMBgCEQCrBFR1A1DH74OcTMJ2D2txAgMBAAE=\n-----END RSA PUBLIC KEY-----\n	-----BEGIN RSA PRIVATE KEY-----\nMGQCAQACEQCrBFR1A1DH74OcTMJ2D2txAgMBAAECEQAO+HUQPTcQGWGhWs0nq/+FAgkA52eN\naM6YuL8CCQC9MaY0dl83zwIJAKopO5MWWLeBAghhZU/UriNyjQIJALiE6CqkqFnM\n-----END RSA PRIVATE KEY-----\n	-----BEGIN RSA PRIVATE KEY-----\nMGECAQACEQCPzAgSa+u6Ij6pyCvXftdZAgMBAAECEFtny73CAj73bn3RPzTq+I0CCQDUnTOX\nmcWZ4wIJAK0j4NC+u76TAggHNJCkCZ0NuwIIR790bEx91I0CCHvEfEFxNC0i\n-----END RSA PRIVATE KEY-----\n	980cde8da050fcba3f148af80cb5d08f8bf720cd8c51c0611bc8ca6c7fa96a496164f558b3bc6e2296c91fb43bf54db9b69de4636f60b7fca94bcf32692333e1	f	\N	\N	\N
3	asdf@asdf.com	$2a$10$uSDrYchS1akM77yLdJiMd.f7HeOHbUiAaw/1.2gmV1JOpWF9k0S8e	1e09aa860cc7dcc896ebe1e964b15f01e2a47944add43608e79ff0ea3aa0c72a36b9e2985bf8dd565c20f2c3364f6932e5e4646068e2ca067f5fe37eaed8076c	$2a$10$uSDrYchS1akM77yLdJiMd.	\N	\N	-----BEGIN RSA PUBLIC KEY-----\nMBgCEQCPjQ4iyQbTC8fF74UkHrStAgMBAAE=\n-----END RSA PUBLIC KEY-----\n	-----BEGIN RSA PRIVATE KEY-----\nMGICAQACEQCPjQ4iyQbTC8fF74UkHrStAgMBAAECEDa7tZQVygBVesYqAoUV/pECCQD2Edax\nGUqoFwIJAJVYFu+r/v/bAgkArkTn9bjhxLUCCGGdq5hLLyljAggBPA2ItPTIvg==\n-----END RSA PRIVATE KEY-----\n	-----BEGIN RSA PRIVATE KEY-----\nMGMCAQACEQCwuBsoZ4w0IB5W/Si5/ZUxAgMBAAECEEK3XtlkLlRG4kJToEB0KTkCCQDuris8\nqMXFQwIJAL2K60QI5Rp7AgkAizklF1kLI6kCCBTaNavUdrAFAgkAv1sQ3ZvkbrU=\n-----END RSA PRIVATE KEY-----\n	6256fbc2be27f79d9797b1013838be3d90b2b7d2b5f8985da25584724c7abe2679b6b7890911e9ec6ecb10a6e2857306d6e6f99a8ed6bb16aa23813fa739d879	f	\N	\N	\N
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cmsc435
--

SELECT pg_catalog.setval('users_id_seq', 3, true);


--
-- Name: data_pkey; Type: CONSTRAINT; Schema: public; Owner: cmsc435; Tablespace: 
--

ALTER TABLE ONLY data
    ADD CONSTRAINT data_pkey PRIMARY KEY (id);


--
-- Name: devices_pkey; Type: CONSTRAINT; Schema: public; Owner: cmsc435; Tablespace: 
--

ALTER TABLE ONLY devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (id);


--
-- Name: invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: cmsc435; Tablespace: 
--

ALTER TABLE ONLY invitations
    ADD CONSTRAINT invitations_pkey PRIMARY KEY (id);


--
-- Name: migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: cmsc435; Tablespace: 
--

ALTER TABLE ONLY migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: users_email_key; Type: CONSTRAINT; Schema: public; Owner: cmsc435; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: cmsc435; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: device_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: cmsc435
--

ALTER TABLE ONLY data
    ADD CONSTRAINT device_id_fk FOREIGN KEY (device_id) REFERENCES devices(id);


--
-- Name: user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: cmsc435
--

ALTER TABLE ONLY devices
    ADD CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: cmsc435
--

ALTER TABLE ONLY invitations
    ADD CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

