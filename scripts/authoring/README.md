Authoring helpers. `make-profile.mjs` fills shared defaults (central pay source, standard
sections) so each profile file only states facts specific to that exam. Run:
node scripts/authoring/make-profile.mjs <spec.json> writes src/data/exams/<jurisdiction>/<id>.json
