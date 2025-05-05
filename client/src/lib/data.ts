// Default medicine lists and constants for autocomplete and selection

export const DEFAULT_MEDICINES = [
  "Aconitum Napellus",
  "Allium Cepa",
  "Antimonium Crudum",
  "Apis Mellifica",
  "Argentum Nitricum",
  "Arnica Montana",
  "Arsenicum Album",
  "Belladonna",
  "Bryonia Alba",
  "Calcarea Carbonica",
  "Calendula Officinalis",
  "Cantharis",
  "Carbo Vegetabilis",
  "Causticum",
  "Chamomilla",
  "Cocculus Indicus",
  "Coffea Cruda",
  "Colocynthis",
  "Euphrasia Officinalis",
  "Ferrum Phosphoricum",
  "Gelsemium Sempervirens",
  "Hepar Sulphuris Calcareum",
  "Hypericum Perforatum",
  "Ignatia Amara",
  "Ipecacuanha",
  "Kali Bichromicum",
  "Kali Carbonicum",
  "Kali Phosphoricum",
  "Ledum Palustre",
  "Lycopodium Clavatum",
  "Magnesia Phosphorica",
  "Mercurius Solubilis",
  "Natrum Muriaticum",
  "Nux Vomica",
  "Phosphorus",
  "Pulsatilla",
  "Rhus Toxicodendron",
  "Ruta Graveolens",
  "Sepia",
  "Silicea",
  "Spongia Tosta",
  "Staphysagria",
  "Sulphur",
  "Symphytum Officinale",
  "Thuja Occidentalis",
  "Veratrum Album"
];

export const POTENCIES = [
  "6C",
  "12C",
  "30C",
  "200C",
  "1M",
  "10M",
  "50M",
  "CM"
];

export const DEFAULT_COMPANIES = [
  "Masood",
  "Kent",
  "BM",
  "SBL",
  "Schwabe",
  "Reckeweg",
  "BJAIN",
  "Bakson's"
];

export const DEFAULT_LOCATIONS = [
  "Home",
  "Office",
  "Travel Kit",
  "First Aid Kit"
];

// Sample data for initial state
export const SAMPLE_MEDICINES = [
  {
    id: 1,
    name: "Arnica Montana",
    potency: "30C",
    company: "Masood",
    location: "Home",
    subLocation: "Medicine Cabinet",
    quantity: 2
  },
  {
    id: 2,
    name: "Belladonna",
    potency: "200C",
    company: "Kent",
    location: "Home",
    subLocation: "Drawer",
    quantity: 1
  },
  {
    id: 3,
    name: "Nux Vomica",
    potency: "30C",
    company: "BM",
    location: "Home",
    subLocation: "Medicine Cabinet",
    quantity: 0
  }
];
