BEGIN;

TRUNCATE
    users,
    certs,
    dives,
    specialties,
    animals,
    countries,
    animalTracker
    RESTART IDENTITY CASCADE;

INSERT INTO users (first_name, email, password, specialties, instructor_specialties, wishlist, wishlist_fulfilled) VALUES
    (
        'Bob',
        'bob@email.com',
        '$2a$12$gLWI9sCiD8ueE01zJgO/QOiIFdv21qnw6u0eAl2fu5qK8bbXXqCJ2',
        '{
            "2",
            "5",
            "6"
        }',
        '{}',
        '{
            "1",
            "2",
            "3",
            "4",
            "5",
            "6"
        }',
        '{
            "1",
            "8"
        }'
    );

INSERT INTO certs (user_id, agency, cert_level, cert_num, cert_date) VALUES
    (
        '1',
        'PADI',
        'Open Water Diver',
        '123ab456',
        'May 2020'       
    );

INSERT INTO dives (user_id, dive_date, country, region, dive_site, max_depth, duration, water_temp, dive_shop, guide, buddy, viz, dive_type, drift_dive, night_dive, description, animals_spotted, rating) VALUES
    (
        '1',
        '2020-05-04',
        'United States of America',
        'Hawaii',
        'Mana Crack',
        '85',
        '55',
        '72',
        'Bubbles Below',
        'Linda',
        'Chris',
        '4',
        'Boat',
        'true',
        'false',
        'Ancient dead coral bed. Sweet nudis and a whitetip.',
        '{
            "1",
            "8"
        }',
        '4'
    );

INSERT INTO specialties (spec_name) VALUES
    ('Altitude Diver'),
    ('Boat Diver'),
    ('Cavern Diver'),
    ('Coral Reef Conservation'),
    ('Deep Diver'),
    ('Digital Underwater Photographer'),
    ('Diver Propulsion Vehicle'),
    ('Drift Diver'),
    ('Dry Suit Diver'),
    ('Emergency Oxygen Provider'),
    ('Enriched Air Diver'),
    ('Equipment Specialist'),
    ('Fish Identification'),
    ('Ice Diver'),
    ('Night Diver'),
    ('Peak Performance Buoyancy'),
    ('Public Safety Diver'),
    ('Search and Recovery Diver'),
    ('Self-Reliant Diver'),
    ('Sidemount Diver'),
    ('Underwater Naturalist'),
    ('Underwater Navigator'),
    ('Underwater Videographer'),
    ('Wreck Diver');

INSERT INTO animals (animal) VALUES
    ('Whale Shark'),
    ('Mola Mola'),
    ('Thresher Shark'),
    ('Hammerhead Shark'),
    ('Great White Shark'),
    ('Tiger Shark'),
    ('Manatee'),
    ('Manta Ray'),
    ('Seahorse'),
    ('Dragon Moray'),
    ('Ribbon Eel'),
    ('Mandarin Fish'),
    ('Frog Fish'),
    ('Mimic Octopus'),
    ('Pygmy Seahorse'),
    ('Leafy Seadragon'),
    ('Blue-Ringed Octopus'),
    ('Flamboyant Cuttlefish'),
    ('Harlequin Shrimp'),
    ('Orangutan Crab'),
    ('Ornate Ghost Pipefish'),
    ('Leaf Scorpionfish');

INSERT INTO countries (country_name, regions) VALUES
    (
    'United States of America',
    '{
        "Hawaii",
        "Pacific Northwest",
        "Florida",
        "California"
    }'
    ),
    (
        'Mexico',
        '{
            "Riviera Maya",
            "Baja",
            "Revillagigedo Islands",
            "Cozumel"
        }'
    ),
    (
        'Australia',
        '{
            "Great Barrier Reef",
            "SS Yongala",
            "Western Australia",
            "Southern Australia",
            "Tasmania"
        }'
    ),
    (
        'Nicaragua',
        '{
            "Corn Islands"
        }'
    ),
    (
        'Cayman Islands',
        '{
            "Little Cayman",
            "Cayman Brac",
            "Grand Cayman, West",
            "Grand Cayman, East",
            "Grand Cayman, North"
        }'
    ),
    (
        'Thailand',
        '{
            "Similan Islands",
            "Koh Tao, Koh Samui, Koh Phangan",
            "Krabi, Koh Lanta",
            "Phuket"
        }'
    ),
    (
        'Indonesia',
        '{
            "Bali, Nusa Lembongan, Nusa Penida",
            "Gili Islands",
            "Raja Ampat",
            "Komodo",
            "Lembeh Strait"
        }'
    ),
    (
        'Philippines',
        '{
            "Malapascua",
            "Puerto Galera",
            "El Nido",
            "Coron",
            "Bohol",
            "Boracay",
            "Apo Reef"
        }'
    ),
    (
        'Honduras',
        '{
            "Utila",
            "Roatan"
        }'
    ),
    (
        'Jamaica',
        '{
            "Montego Bay",
            "Negril"
        }'
    );

INSERT INTO animalTracker (animal, country, region) VALUES
    (
        'Whale Shark',
        'United States of America',
        'Hawaii'
    ),
    (
        'Manta Ray',
        'United States of America',
        'Hawaii'
    );



COMMIT;