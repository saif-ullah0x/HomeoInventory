// Comprehensive Homeopathic Medicine Database from ISM & H Essential Drugs List
// Source: Homoeopathic Pharmacopiea, Department of ISM & H

export interface HomeopathicMedicine {
  id: number;
  name: string;
  fullName: string;
  alternativeNames: string[];
  category: 'potentized' | 'mother_tincture' | 'biochemic' | 'external' | 'ointment';
  commonUses: string[];
  searchTerms: string[];
}

export const HOMEOPATHIC_MEDICINES: HomeopathicMedicine[] = [
  // List A - Potentized Medicines
  { id: 1, name: "Abrotanum", fullName: "Abrotanum", alternativeNames: ["Abrot"], category: "potentized", commonUses: ["digestive issues", "weakness"], searchTerms: ["abrotanum", "abrot"] },
  { id: 2, name: "Absinthium", fullName: "Absinthium", alternativeNames: ["Absin"], category: "potentized", commonUses: ["nervous disorders", "convulsions"], searchTerms: ["absinthium", "absin"] },
  { id: 3, name: "Aconitum nap", fullName: "Aconitum Napellus", alternativeNames: ["Aconite", "Acon"], category: "potentized", commonUses: ["sudden fever", "anxiety", "shock"], searchTerms: ["aconitum", "aconite", "acon", "napellus"] },
  { id: 4, name: "Actea racemosa", fullName: "Actaea Racemosa", alternativeNames: ["Cimicifuga", "Black Cohosh"], category: "potentized", commonUses: ["women's health", "muscle pain"], searchTerms: ["actea", "actaea", "racemosa", "cimicifuga"] },
  { id: 5, name: "Acalypha India", fullName: "Acalypha Indica", alternativeNames: ["Acal"], category: "potentized", commonUses: ["respiratory issues", "cough"], searchTerms: ["acalypha", "indica", "acal"] },
  { id: 6, name: "Aesculus hip", fullName: "Aesculus Hippocastanum", alternativeNames: ["Horse Chestnut"], category: "potentized", commonUses: ["hemorrhoids", "circulation"], searchTerms: ["aesculus", "hippocastanum", "horse chestnut"] },
  { id: 7, name: "Agaricus", fullName: "Agaricus Muscarius", alternativeNames: ["Agar"], category: "potentized", commonUses: ["nervous twitching", "chilblains"], searchTerms: ["agaricus", "muscarius", "agar"] },
  { id: 8, name: "Alumina", fullName: "Alumina", alternativeNames: ["Alum"], category: "potentized", commonUses: ["constipation", "memory issues"], searchTerms: ["alumina", "alum"] },
  { id: 9, name: "Allium cepa", fullName: "Allium Cepa", alternativeNames: ["Onion", "All-c"], category: "potentized", commonUses: ["cold", "runny nose", "hay fever"], searchTerms: ["allium", "cepa", "onion", "all-c"] },
  { id: 10, name: "Aloe soc", fullName: "Aloe Socotrina", alternativeNames: ["Aloe"], category: "potentized", commonUses: ["digestive problems", "hemorrhoids"], searchTerms: ["aloe", "socotrina"] },
  { id: 11, name: "Ammonium carb", fullName: "Ammonium Carbonicum", alternativeNames: ["Am-c"], category: "potentized", commonUses: ["respiratory issues", "weakness"], searchTerms: ["ammonium", "carbonicum", "am-c"] },
  { id: 12, name: "Ammonium mur", fullName: "Ammonium Muriaticum", alternativeNames: ["Am-m"], category: "potentized", commonUses: ["respiratory problems", "joint stiffness"], searchTerms: ["ammonium", "muriaticum", "am-m"] },
  { id: 13, name: "Ammonium phos", fullName: "Ammonium Phosphoricum", alternativeNames: ["Am-p"], category: "potentized", commonUses: ["chest conditions", "bronchitis"], searchTerms: ["ammonium", "phosphoricum", "am-p"] },
  { id: 14, name: "Angustura vera", fullName: "Angustura Vera", alternativeNames: ["Ang"], category: "potentized", commonUses: ["bone pain", "fractures"], searchTerms: ["angustura", "vera", "ang"] },
  { id: 15, name: "Antimonium crud", fullName: "Antimonium Crudum", alternativeNames: ["Ant-c"], category: "potentized", commonUses: ["skin conditions", "digestive issues"], searchTerms: ["antimonium", "crudum", "ant-c"] },
  { id: 16, name: "Antimonium tart", fullName: "Antimonium Tartaricum", alternativeNames: ["Ant-t"], category: "potentized", commonUses: ["respiratory problems", "rattling cough"], searchTerms: ["antimonium", "tartaricum", "ant-t"] },
  { id: 17, name: "Anacardium", fullName: "Anacardium Orientale", alternativeNames: ["Anac"], category: "potentized", commonUses: ["memory problems", "digestive issues"], searchTerms: ["anacardium", "orientale", "anac"] },
  { id: 18, name: "Anthracinum", fullName: "Anthracinum", alternativeNames: ["Anthr"], category: "potentized", commonUses: ["septic conditions", "boils"], searchTerms: ["anthracinum", "anthr"] },
  { id: 19, name: "Apis mel", fullName: "Apis Mellifica", alternativeNames: ["Apis"], category: "potentized", commonUses: ["swelling", "allergic reactions", "bee stings"], searchTerms: ["apis", "mellifica"] },
  { id: 20, name: "Apocynum", fullName: "Apocynum Cannabinum", alternativeNames: ["Apoc"], category: "potentized", commonUses: ["heart conditions", "dropsy"], searchTerms: ["apocynum", "cannabinum", "apoc"] },
  { id: 21, name: "Arsenicum album", fullName: "Arsenicum Album", alternativeNames: ["Ars", "Ars-alb"], category: "potentized", commonUses: ["anxiety", "food poisoning", "restlessness"], searchTerms: ["arsenicum", "album", "ars", "ars-alb"] },
  { id: 22, name: "Arnica mont", fullName: "Arnica Montana", alternativeNames: ["Arnica", "Arn"], category: "potentized", commonUses: ["trauma", "bruises", "shock"], searchTerms: ["arnica", "montana", "arn"] },
  { id: 23, name: "Arg nit", fullName: "Argentum Nitricum", alternativeNames: ["Arg-n", "Silver Nitrate"], category: "potentized", commonUses: ["anxiety", "anticipation", "digestive problems"], searchTerms: ["argentum", "nitricum", "arg-n", "silver nitrate"] },
  { id: 24, name: "Arg met", fullName: "Argentum Metallicum", alternativeNames: ["Arg-m"], category: "potentized", commonUses: ["throat problems", "voice issues"], searchTerms: ["argentum", "metallicum", "arg-m"] },
  { id: 25, name: "Aur met", fullName: "Aurum Metallicum", alternativeNames: ["Aur", "Gold"], category: "potentized", commonUses: ["depression", "heart problems"], searchTerms: ["aurum", "metallicum", "aur", "gold"] },
  { id: 26, name: "Bacillinum", fullName: "Bacillinum", alternativeNames: ["Bacill"], category: "potentized", commonUses: ["tuberculosis miasm", "respiratory issues"], searchTerms: ["bacillinum", "bacill"] },
  { id: 27, name: "Badiaga", fullName: "Badiaga", alternativeNames: ["Bad"], category: "potentized", commonUses: ["glandular swellings", "lymph nodes"], searchTerms: ["badiaga", "bad"] },
  { id: 28, name: "Baptisia", fullName: "Baptisia Tinctoria", alternativeNames: ["Bapt"], category: "potentized", commonUses: ["septic fever", "confusion"], searchTerms: ["baptisia", "tinctoria", "bapt"] },
  { id: 29, name: "Belladonna", fullName: "Belladonna", alternativeNames: ["Bell"], category: "potentized", commonUses: ["sudden fever", "headache", "inflammation"], searchTerms: ["belladonna", "bell"] },
  { id: 30, name: "Benzoic acid", fullName: "Benzoicum Acidum", alternativeNames: ["Benz-ac"], category: "potentized", commonUses: ["urinary problems", "gout"], searchTerms: ["benzoic", "acidum", "benz-ac"] },
  { id: 31, name: "Bar carb", fullName: "Baryta Carbonica", alternativeNames: ["Bar-c"], category: "potentized", commonUses: ["developmental delays", "tonsil problems"], searchTerms: ["baryta", "carbonica", "bar-c"] },
  { id: 32, name: "Baryta mur", fullName: "Baryta Muriatica", alternativeNames: ["Bar-m"], category: "potentized", commonUses: ["glandular problems", "hardening"], searchTerms: ["baryta", "muriatica", "bar-m"] },
  { id: 33, name: "Berberis vulgaris", fullName: "Berberis Vulgaris", alternativeNames: ["Berb"], category: "potentized", commonUses: ["kidney stones", "back pain"], searchTerms: ["berberis", "vulgaris", "berb"] },
  { id: 34, name: "Bellis per", fullName: "Bellis Perennis", alternativeNames: ["Bell-p"], category: "potentized", commonUses: ["trauma", "sprains", "deep injuries"], searchTerms: ["bellis", "perennis", "bell-p"] },
  { id: 35, name: "Bismuth", fullName: "Bismuthum", alternativeNames: ["Bism"], category: "potentized", commonUses: ["digestive problems", "nausea"], searchTerms: ["bismuth", "bismuthum", "bism"] },
  { id: 36, name: "Bovista", fullName: "Bovista", alternativeNames: ["Bov"], category: "potentized", commonUses: ["skin conditions", "eczema"], searchTerms: ["bovista", "bov"] },
  { id: 37, name: "Borax", fullName: "Borax", alternativeNames: ["Bor"], category: "potentized", commonUses: ["thrush", "mouth problems"], searchTerms: ["borax", "bor"] },
  { id: 38, name: "Bryonia alba", fullName: "Bryonia Alba", alternativeNames: ["Bry"], category: "potentized", commonUses: ["dry cough", "worse motion", "irritability"], searchTerms: ["bryonia", "alba", "bry"] },
  { id: 39, name: "Bromium", fullName: "Bromium", alternativeNames: ["Brom"], category: "potentized", commonUses: ["respiratory problems", "glandular swelling"], searchTerms: ["bromium", "brom"] },
  { id: 40, name: "Bufo rana", fullName: "Bufo Rana", alternativeNames: ["Bufo"], category: "potentized", commonUses: ["epilepsy", "skin problems"], searchTerms: ["bufo", "rana"] },
  { id: 41, name: "Camphora", fullName: "Camphora", alternativeNames: ["Camph"], category: "potentized", commonUses: ["collapse", "cholera"], searchTerms: ["camphora", "camph"] },
  { id: 42, name: "Carcinosin", fullName: "Carcinosinum", alternativeNames: ["Carc"], category: "potentized", commonUses: ["cancer miasm", "chronic disease"], searchTerms: ["carcinosin", "carcinosinum", "carc"] },
  { id: 43, name: "Calc carb", fullName: "Calcarea Carbonica", alternativeNames: ["Calc-c", "Calcium"], category: "potentized", commonUses: ["slow development", "sweating", "fears"], searchTerms: ["calcarea", "carbonica", "calc-c", "calcium"] },
  { id: 44, name: "Calendula", fullName: "Calendula Officinalis", alternativeNames: ["Calen"], category: "potentized", commonUses: ["wounds", "cuts", "healing"], searchTerms: ["calendula", "officinalis", "calen"] },
  { id: 45, name: "Cannabis indica", fullName: "Cannabis Indica", alternativeNames: ["Cann-i"], category: "potentized", commonUses: ["urinary problems", "mental confusion"], searchTerms: ["cannabis", "indica", "cann-i"] },
  { id: 46, name: "Causticum", fullName: "Causticum", alternativeNames: ["Caust"], category: "potentized", commonUses: ["paralysis", "burns", "urinary incontinence"], searchTerms: ["causticum", "caust"] },
  { id: 47, name: "Cactus G", fullName: "Cactus Grandiflorus", alternativeNames: ["Cact"], category: "potentized", commonUses: ["heart problems", "chest pain"], searchTerms: ["cactus", "grandiflorus", "cact"] },
  { id: 48, name: "Capsicum", fullName: "Capsicum", alternativeNames: ["Caps"], category: "potentized", commonUses: ["throat problems", "homesickness"], searchTerms: ["capsicum", "caps"] },
  { id: 49, name: "Carbo veg", fullName: "Carbo Vegetabilis", alternativeNames: ["Carb-v"], category: "potentized", commonUses: ["weakness", "digestive problems", "flatulence"], searchTerms: ["carbo", "vegetabilis", "carb-v"] },
  { id: 50, name: "Carbolic acid", fullName: "Carbolicum Acidum", alternativeNames: ["Carb-ac"], category: "potentized", commonUses: ["septic conditions", "putrid discharges"], searchTerms: ["carbolic", "acidum", "carb-ac"] },
  { id: 51, name: "Carbo animals", fullName: "Carbo Animalis", alternativeNames: ["Carb-an"], category: "potentized", commonUses: ["glandular hardening", "venous congestion"], searchTerms: ["carbo", "animalis", "carb-an"] },
  { id: 52, name: "Calc fluor", fullName: "Calcarea Fluorica", alternativeNames: ["Calc-f"], category: "potentized", commonUses: ["hard swellings", "varicose veins"], searchTerms: ["calcarea", "fluorica", "calc-f"] },
  { id: 53, name: "Calc phos", fullName: "Calcarea Phosphorica", alternativeNames: ["Calc-p"], category: "potentized", commonUses: ["bone problems", "slow healing"], searchTerms: ["calcarea", "phosphorica", "calc-p"] },
  { id: 54, name: "Cantharis", fullName: "Cantharis", alternativeNames: ["Canth"], category: "potentized", commonUses: ["burns", "urinary tract infections"], searchTerms: ["cantharis", "canth"] },
  { id: 55, name: "Caulophyllum", fullName: "Caulophyllum Thalictroides", alternativeNames: ["Caul"], category: "potentized", commonUses: ["labor pains", "women's health"], searchTerms: ["caulophyllum", "thalictroides", "caul"] },
  { id: 56, name: "Carduus marianus", fullName: "Carduus Marianus", alternativeNames: ["Card-m"], category: "potentized", commonUses: ["liver problems", "varicose veins"], searchTerms: ["carduus", "marianus", "card-m"] },
  { id: 57, name: "Cedron", fullName: "Cedron", alternativeNames: ["Cedr"], category: "potentized", commonUses: ["periodic fevers", "neuralgic pains"], searchTerms: ["cedron", "cedr"] },
  { id: 58, name: "China officinalis", fullName: "China Officinalis", alternativeNames: ["Chin", "Cinchona"], category: "potentized", commonUses: ["weakness after fluid loss", "intermittent fever"], searchTerms: ["china", "officinalis", "chin", "cinchona"] },
  { id: 59, name: "China ars", fullName: "China Arsenicosa", alternativeNames: ["Chin-a"], category: "potentized", commonUses: ["periodic weakness", "malaria"], searchTerms: ["china", "arsenicosa", "chin-a"] },
  { id: 60, name: "China sulph", fullName: "China Sulphurica", alternativeNames: ["Chin-s"], category: "potentized", commonUses: ["intermittent fever", "liver problems"], searchTerms: ["china", "sulphurica", "chin-s"] },
  { id: 61, name: "Chamomilla", fullName: "Chamomilla", alternativeNames: ["Cham"], category: "potentized", commonUses: ["irritability", "teething", "colic"], searchTerms: ["chamomilla", "cham"] },
  { id: 62, name: "Chelidonium", fullName: "Chelidonium Majus", alternativeNames: ["Chel"], category: "potentized", commonUses: ["liver problems", "right-sided symptoms"], searchTerms: ["chelidonium", "majus", "chel"] },
  { id: 63, name: "Cina", fullName: "Cina", alternativeNames: ["Cin"], category: "potentized", commonUses: ["worms", "children's irritability"], searchTerms: ["cina", "cin"] },
  { id: 64, name: "Cicuta virosa", fullName: "Cicuta Virosa", alternativeNames: ["Cic"], category: "potentized", commonUses: ["convulsions", "head injuries"], searchTerms: ["cicuta", "virosa", "cic"] },
  { id: 65, name: "Cocculus indicus", fullName: "Cocculus Indicus", alternativeNames: ["Cocc"], category: "potentized", commonUses: ["motion sickness", "dizziness"], searchTerms: ["cocculus", "indicus", "cocc"] },
  { id: 66, name: "Coca", fullName: "Coca", alternativeNames: ["Coc"], category: "potentized", commonUses: ["mental fatigue", "altitude sickness"], searchTerms: ["coca", "coc"] },
  { id: 67, name: "Coffea", fullName: "Coffea Cruda", alternativeNames: ["Coff"], category: "potentized", commonUses: ["insomnia", "oversensitivity"], searchTerms: ["coffea", "cruda", "coff"] },
  { id: 68, name: "Colchicum", fullName: "Colchicum Autumnale", alternativeNames: ["Colch"], category: "potentized", commonUses: ["gout", "joint pain"], searchTerms: ["colchicum", "autumnale", "colch"] },
  { id: 69, name: "Conium", fullName: "Conium Maculatum", alternativeNames: ["Con"], category: "potentized", commonUses: ["glandular hardening", "dizziness"], searchTerms: ["conium", "maculatum", "con"] },
  { id: 70, name: "Croton tig", fullName: "Croton Tiglium", alternativeNames: ["Crot-t"], category: "potentized", commonUses: ["skin eruptions", "diarrhea"], searchTerms: ["croton", "tiglium", "crot-t"] },
  { id: 71, name: "Crotalus horridus", fullName: "Crotalus Horridus", alternativeNames: ["Crot-h"], category: "potentized", commonUses: ["hemorrhage", "septic conditions"], searchTerms: ["crotalus", "horridus", "crot-h"] },
  { id: 72, name: "Colocynthis", fullName: "Colocynthis", alternativeNames: ["Coloc"], category: "potentized", commonUses: ["cramping pains", "colic"], searchTerms: ["colocynthis", "coloc"] },
  { id: 73, name: "Cundurango", fullName: "Cundurango", alternativeNames: ["Cund"], category: "potentized", commonUses: ["stomach problems", "ulcers"], searchTerms: ["cundurango", "cund"] },
  { id: 74, name: "Cuprum met", fullName: "Cuprum Metallicum", alternativeNames: ["Cupr"], category: "potentized", commonUses: ["cramps", "convulsions"], searchTerms: ["cuprum", "metallicum", "cupr"] },
  { id: 75, name: "Digitalis", fullName: "Digitalis Purpurea", alternativeNames: ["Dig"], category: "potentized", commonUses: ["heart problems", "weak pulse"], searchTerms: ["digitalis", "purpurea", "dig"] },
  { id: 76, name: "Dioscorea", fullName: "Dioscorea Villosa", alternativeNames: ["Dios"], category: "potentized", commonUses: ["colic", "renal colic"], searchTerms: ["dioscorea", "villosa", "dios"] },
  { id: 77, name: "Diphtherinum", fullName: "Diphtherinum", alternativeNames: ["Diph"], category: "potentized", commonUses: ["diphtheria nosode", "chronic weakness"], searchTerms: ["diphtherinum", "diph"] },
  { id: 78, name: "Drosera", fullName: "Drosera Rotundifolia", alternativeNames: ["Dros"], category: "potentized", commonUses: ["whooping cough", "spasmodic cough"], searchTerms: ["drosera", "rotundifolia", "dros"] },
  { id: 79, name: "Dulcamara", fullName: "Dulcamara", alternativeNames: ["Dulc"], category: "potentized", commonUses: ["cold damp weather", "skin conditions"], searchTerms: ["dulcamara", "dulc"] },
  { id: 80, name: "Equisetum", fullName: "Equisetum Hiemale", alternativeNames: ["Equis"], category: "potentized", commonUses: ["urinary incontinence", "bedwetting"], searchTerms: ["equisetum", "hiemale", "equis"] },
  { id: 81, name: "Formica rufa", fullName: "Formica Rufa", alternativeNames: ["Form"], category: "potentized", commonUses: ["gout", "rheumatism"], searchTerms: ["formica", "rufa", "form"] },
  { id: 82, name: "Eupatorium perfoliatum", fullName: "Eupatorium Perfoliatum", alternativeNames: ["Eup-per"], category: "potentized", commonUses: ["bone-breaking fever", "influenza"], searchTerms: ["eupatorium", "perfoliatum", "eup-per"] },
  { id: 83, name: "Euphrasia", fullName: "Euphrasia Officinalis", alternativeNames: ["Euph"], category: "potentized", commonUses: ["eye problems", "conjunctivitis"], searchTerms: ["euphrasia", "officinalis", "euph"] },
  { id: 84, name: "Ferrum met", fullName: "Ferrum Metallicum", alternativeNames: ["Ferr"], category: "potentized", commonUses: ["anemia", "weakness"], searchTerms: ["ferrum", "metallicum", "ferr"] },
  { id: 85, name: "Flouric acid", fullName: "Fluoricum Acidum", alternativeNames: ["Fl-ac"], category: "potentized", commonUses: ["bone problems", "varicose veins"], searchTerms: ["fluoric", "acidum", "fl-ac"] },
  { id: 86, name: "Gelsemium", fullName: "Gelsemium Sempervirens", alternativeNames: ["Gels"], category: "potentized", commonUses: ["dizziness", "anxiety", "weakness"], searchTerms: ["gelsemium", "sempervirens", "gels"] },
  { id: 87, name: "Glonoine", fullName: "Glonoine", alternativeNames: ["Glon"], category: "potentized", commonUses: ["sunstroke", "bursting headache"], searchTerms: ["glonoine", "glon"] },
  { id: 88, name: "Graphites", fullName: "Graphites", alternativeNames: ["Graph"], category: "potentized", commonUses: ["skin conditions", "constipation"], searchTerms: ["graphites", "graph"] },
  { id: 89, name: "Guaiacum", fullName: "Guaiacum", alternativeNames: ["Guai"], category: "potentized", commonUses: ["rheumatism", "sore throat"], searchTerms: ["guaiacum", "guai"] },
  { id: 90, name: "Hamamelis vir", fullName: "Hamamelis Virginiana", alternativeNames: ["Ham"], category: "potentized", commonUses: ["hemorrhoids", "varicose veins"], searchTerms: ["hamamelis", "virginiana", "ham"] },
  { id: 91, name: "Helleborus", fullName: "Helleborus Niger", alternativeNames: ["Hell"], category: "potentized", commonUses: ["depression", "stupor"], searchTerms: ["helleborus", "niger", "hell"] },
  { id: 92, name: "Hepar sulph", fullName: "Hepar Sulphuris Calcareum", alternativeNames: ["Hep"], category: "potentized", commonUses: ["suppuration", "infected wounds"], searchTerms: ["hepar", "sulphuris", "calcareum", "hep"] },
  { id: 93, name: "Hippoz aenium", fullName: "Hippozaenium", alternativeNames: ["Hipp"], category: "potentized", commonUses: ["nasal discharge", "glanders nosode"], searchTerms: ["hippoz", "aenium", "hipp"] },
  { id: 94, name: "Hyoscyamus", fullName: "Hyoscyamus Niger", alternativeNames: ["Hyos"], category: "potentized", commonUses: ["mania", "jealousy"], searchTerms: ["hyoscyamus", "niger", "hyos"] },
  { id: 95, name: "Hydrocotyle asiatica", fullName: "Hydrocotyle Asiatica", alternativeNames: ["Hydr"], category: "potentized", commonUses: ["skin problems", "lupus"], searchTerms: ["hydrocotyle", "asiatica", "hydr"] },
  { id: 96, name: "Hydrastis", fullName: "Hydrastis Canadensis", alternativeNames: ["Hydr"], category: "potentized", commonUses: ["thick yellow discharges", "stomach problems"], searchTerms: ["hydrastis", "canadensis", "hydr"] },
  { id: 97, name: "Hypericum", fullName: "Hypericum Perforatum", alternativeNames: ["Hyper"], category: "potentized", commonUses: ["nerve injuries", "puncture wounds"], searchTerms: ["hypericum", "perforatum", "hyper"] },
  { id: 98, name: "Ipecacuanha", fullName: "Ipecacuanha", alternativeNames: ["Ip"], category: "potentized", commonUses: ["nausea", "vomiting", "bleeding"], searchTerms: ["ipecacuanha", "ip"] },
  { id: 99, name: "Ignatia", fullName: "Ignatia Amara", alternativeNames: ["Ign"], category: "potentized", commonUses: ["grief", "emotional shock", "contradictory symptoms"], searchTerms: ["ignatia", "amara", "ign"] },
  { id: 100, name: "Iristenax", fullName: "Iris Tenax", alternativeNames: ["Iris-t"], category: "potentized", commonUses: ["headache", "migraine"], searchTerms: ["iris", "tenax", "iris-t"] },

  // Continue with remaining medicines...
  { id: 101, name: "Iris versicolor", fullName: "Iris Versicolor", alternativeNames: ["Iris"], category: "potentized", commonUses: ["migraine", "vomiting"], searchTerms: ["iris", "versicolor"] },
  { id: 102, name: "Iodum", fullName: "Iodum", alternativeNames: ["Iod"], category: "potentized", commonUses: ["glandular problems", "hyperthyroidism"], searchTerms: ["iodum", "iod"] },
  { id: 103, name: "Kali bich", fullName: "Kali Bichromicum", alternativeNames: ["Kali-bi"], category: "potentized", commonUses: ["thick stringy discharges", "sinusitis"], searchTerms: ["kali", "bichromicum", "kali-bi"] },
  { id: 104, name: "Kali carb", fullName: "Kali Carbonicum", alternativeNames: ["Kali-c"], category: "potentized", commonUses: ["weakness", "back pain", "asthma"], searchTerms: ["kali", "carbonicum", "kali-c"] },
  { id: 105, name: "Kali sulph", fullName: "Kali Sulphuricum", alternativeNames: ["Kali-s"], category: "potentized", commonUses: ["yellow discharges", "skin problems"], searchTerms: ["kali", "sulphuricum", "kali-s"] },
  { id: 106, name: "Kali bromatum", fullName: "Kali Bromatum", alternativeNames: ["Kali-br"], category: "potentized", commonUses: ["epilepsy", "acne"], searchTerms: ["kali", "bromatum", "kali-br"] },
  { id: 107, name: "Kali cyanatum", fullName: "Kali Cyanatum", alternativeNames: ["Kali-cy"], category: "potentized", commonUses: ["asthma", "cardiac problems"], searchTerms: ["kali", "cyanatum", "kali-cy"] },
  { id: 108, name: "Kali iod", fullName: "Kali Iodatum", alternativeNames: ["Kali-i"], category: "potentized", commonUses: ["glandular swelling", "syphilitic conditions"], searchTerms: ["kali", "iodatum", "kali-i"] },
  { id: 109, name: "Kali mur", fullName: "Kali Muriaticum", alternativeNames: ["Kali-m"], category: "potentized", commonUses: ["white discharges", "ear problems"], searchTerms: ["kali", "muriaticum", "kali-m"] },
  { id: 110, name: "Kalmia latifolia", fullName: "Kalmia Latifolia", alternativeNames: ["Kalm"], category: "potentized", commonUses: ["heart problems", "rheumatic pains"], searchTerms: ["kalmia", "latifolia", "kalm"] },
  { id: 111, name: "Kreosotum", fullName: "Kreosotum", alternativeNames: ["Kreos"], category: "potentized", commonUses: ["offensive discharges", "dental problems"], searchTerms: ["kreosotum", "kreos"] },
  { id: 112, name: "Lapis albus", fullName: "Lapis Albus", alternativeNames: ["Lap-a"], category: "potentized", commonUses: ["glandular swellings", "goiter"], searchTerms: ["lapis", "albus", "lap-a"] },
  { id: 113, name: "Lachesis", fullName: "Lachesis Mutus", alternativeNames: ["Lach"], category: "potentized", commonUses: ["jealousy", "left-sided symptoms", "menopause"], searchTerms: ["lachesis", "mutus", "lach"] },
  { id: 114, name: "Lac can", fullName: "Lac Caninum", alternativeNames: ["Lac-c"], category: "potentized", commonUses: ["alternating symptoms", "throat problems"], searchTerms: ["lac", "caninum", "lac-c"] },
  { id: 115, name: "Lac defloratum", fullName: "Lac Defloratum", alternativeNames: ["Lac-d"], category: "potentized", commonUses: ["nausea", "headache"], searchTerms: ["lac", "defloratum", "lac-d"] },
  { id: 116, name: "Ledum pal", fullName: "Ledum Palustre", alternativeNames: ["Led"], category: "potentized", commonUses: ["puncture wounds", "insect bites"], searchTerms: ["ledum", "palustre", "led"] },
  { id: 117, name: "Lillium tig", fullName: "Lilium Tigrinum", alternativeNames: ["Lil-t"], category: "potentized", commonUses: ["women's problems", "prolapse"], searchTerms: ["lilium", "tigrinum", "lil-t"] },
  { id: 118, name: "Lobella inflata", fullName: "Lobelia Inflata", alternativeNames: ["Lob"], category: "potentized", commonUses: ["asthma", "respiratory problems"], searchTerms: ["lobelia", "inflata", "lob"] },
  { id: 119, name: "Lycopodium", fullName: "Lycopodium Clavatum", alternativeNames: ["Lyc"], category: "potentized", commonUses: ["digestive problems", "liver issues", "right-sided symptoms"], searchTerms: ["lycopodium", "clavatum", "lyc"] },
  { id: 120, name: "Lyssin", fullName: "Lyssin", alternativeNames: ["Lyss"], category: "potentized", commonUses: ["hydrophobia", "spasms"], searchTerms: ["lyssin", "lyss"] },
  { id: 121, name: "Mag carb", fullName: "Magnesia Carbonica", alternativeNames: ["Mag-c"], category: "potentized", commonUses: ["toothache", "sour stomach"], searchTerms: ["magnesia", "carbonica", "mag-c"] },
  { id: 122, name: "Mag phos", fullName: "Magnesia Phosphorica", alternativeNames: ["Mag-p"], category: "potentized", commonUses: ["cramps", "neuralgic pains"], searchTerms: ["magnesia", "phosphorica", "mag-p"] },
  { id: 123, name: "Medorrhinum", fullName: "Medorrhinum", alternativeNames: ["Med"], category: "potentized", commonUses: ["gonorrheal miasm", "asthma"], searchTerms: ["medorrhinum", "med"] },
  { id: 124, name: "Merc sol", fullName: "Mercurius Solubilis", alternativeNames: ["Merc"], category: "potentized", commonUses: ["glandular swelling", "offensive discharges"], searchTerms: ["mercurius", "solubilis", "merc"] },
  { id: 125, name: "Merc sulph", fullName: "Mercurius Sulphuricus", alternativeNames: ["Merc-s"], category: "potentized", commonUses: ["liver problems", "jaundice"], searchTerms: ["mercurius", "sulphuricus", "merc-s"] },
  { id: 126, name: "Mezereum", fullName: "Mezereum", alternativeNames: ["Mez"], category: "potentized", commonUses: ["skin eruptions", "neuralgia"], searchTerms: ["mezereum", "mez"] },
  { id: 127, name: "Mercurius", fullName: "Mercurius Vivus", alternativeNames: ["Merc-v"], category: "potentized", commonUses: ["mercury poisoning", "tremors"], searchTerms: ["mercurius", "vivus", "merc-v"] },
  { id: 128, name: "Millefolium", fullName: "Millefolium", alternativeNames: ["Mill"], category: "potentized", commonUses: ["hemorrhage", "nosebleeds"], searchTerms: ["millefolium", "mill"] },
  { id: 129, name: "Mur Acid", fullName: "Muriaticum Acidum", alternativeNames: ["Mur-ac"], category: "potentized", commonUses: ["weakness", "ulcers"], searchTerms: ["muriaticum", "acidum", "mur-ac"] },
  { id: 130, name: "Murex", fullName: "Murex Purpurea", alternativeNames: ["Murx"], category: "potentized", commonUses: ["women's problems", "prolapse"], searchTerms: ["murex", "purpurea", "murx"] },
  { id: 131, name: "Mygale", fullName: "Mygale Lasiodora", alternativeNames: ["Myg"], category: "potentized", commonUses: ["chorea", "twitching"], searchTerms: ["mygale", "lasiodora", "myg"] },
  { id: 132, name: "Naja tri", fullName: "Naja Tripudians", alternativeNames: ["Naja"], category: "potentized", commonUses: ["heart problems", "left-sided symptoms"], searchTerms: ["naja", "tripudians"] },
  { id: 133, name: "Nat mur", fullName: "Natrum Muriaticum", alternativeNames: ["Nat-m"], category: "potentized", commonUses: ["grief", "headache", "salt craving"], searchTerms: ["natrum", "muriaticum", "nat-m"] },
  { id: 134, name: "Nat phos", fullName: "Natrum Phosphoricum", alternativeNames: ["Nat-p"], category: "potentized", commonUses: ["acidity", "sour stomach"], searchTerms: ["natrum", "phosphoricum", "nat-p"] },
  { id: 135, name: "Nat carb", fullName: "Natrum Carbonicum", alternativeNames: ["Nat-c"], category: "potentized", commonUses: ["sun sensitivity", "digestive weakness"], searchTerms: ["natrum", "carbonicum", "nat-c"] },
  { id: 136, name: "Nat sulph", fullName: "Natrum Sulphuricum", alternativeNames: ["Nat-s"], category: "potentized", commonUses: ["asthma", "liver problems"], searchTerms: ["natrum", "sulphuricum", "nat-s"] },
  { id: 137, name: "Nat ars", fullName: "Natrum Arsenicatum", alternativeNames: ["Nat-a"], category: "potentized", commonUses: ["skin problems", "psoriasis"], searchTerms: ["natrum", "arsenicatum", "nat-a"] },
  { id: 138, name: "Nit acid", fullName: "Nitricum Acidum", alternativeNames: ["Nit-ac"], category: "potentized", commonUses: ["ulcers", "offensive discharges"], searchTerms: ["nitricum", "acidum", "nit-ac"] },
  { id: 139, name: "Nux vom", fullName: "Nux Vomica", alternativeNames: ["Nux-v"], category: "potentized", commonUses: ["irritability", "digestive problems", "oversensitivity"], searchTerms: ["nux", "vomica", "nux-v"] },
  { id: 140, name: "Nyctanthes arbor", fullName: "Nyctanthes Arbor Tristis", alternativeNames: ["Nyct"], category: "potentized", commonUses: ["constipation", "liver problems"], searchTerms: ["nyctanthes", "arbor", "tristis", "nyct"] },
  { id: 141, name: "Opium", fullName: "Opium", alternativeNames: ["Op"], category: "potentized", commonUses: ["stupor", "constipation"], searchTerms: ["opium", "op"] },
  { id: 142, name: "Oleander", fullName: "Oleander", alternativeNames: ["Olnd"], category: "potentized", commonUses: ["heart problems", "skin eruptions"], searchTerms: ["oleander", "olnd"] },
  { id: 143, name: "Petroleum", fullName: "Petroleum", alternativeNames: ["Petr"], category: "potentized", commonUses: ["skin problems", "motion sickness"], searchTerms: ["petroleum", "petr"] },
  { id: 144, name: "Phosphorus", fullName: "Phosphorus", alternativeNames: ["Phos"], category: "potentized", commonUses: ["hemorrhage", "pneumonia", "anxiety"], searchTerms: ["phosphorus", "phos"] },
  { id: 145, name: "Phosphoric acid", fullName: "Phosphoricum Acidum", alternativeNames: ["Ph-ac"], category: "potentized", commonUses: ["mental exhaustion", "hair loss"], searchTerms: ["phosphoric", "acidum", "ph-ac"] },
  { id: 146, name: "Phytolacca", fullName: "Phytolacca Decandra", alternativeNames: ["Phyt"], category: "potentized", commonUses: ["sore throat", "breast problems"], searchTerms: ["phytolacca", "decandra", "phyt"] },
  { id: 147, name: "Physostigma", fullName: "Physostigma Venenosum", alternativeNames: ["Phys"], category: "potentized", commonUses: ["eye problems", "muscle weakness"], searchTerms: ["physostigma", "venenosum", "phys"] },
  { id: 148, name: "Platina", fullName: "Platina", alternativeNames: ["Plat"], category: "potentized", commonUses: ["women's problems", "pride"], searchTerms: ["platina", "plat"] },
  { id: 149, name: "Plumbum met", fullName: "Plumbum Metallicum", alternativeNames: ["Plb"], category: "potentized", commonUses: ["paralysis", "colic"], searchTerms: ["plumbum", "metallicum", "plb"] },
  { id: 150, name: "Podophyllum", fullName: "Podophyllum Peltatum", alternativeNames: ["Podo"], category: "potentized", commonUses: ["diarrhea", "liver problems"], searchTerms: ["podophyllum", "peltatum", "podo"] },
  { id: 151, name: "Prunus spinosa", fullName: "Prunus Spinosa", alternativeNames: ["Prun"], category: "potentized", commonUses: ["eye pain", "neuralgia"], searchTerms: ["prunus", "spinosa", "prun"] },
  { id: 152, name: "Psorinum", fullName: "Psorinum", alternativeNames: ["Psor"], category: "potentized", commonUses: ["psoric miasm", "skin problems"], searchTerms: ["psorinum", "psor"] },
  { id: 153, name: "Pulsatilla", fullName: "Pulsatilla Nigricans", alternativeNames: ["Puls"], category: "potentized", commonUses: ["changeability", "mild disposition", "thick yellow discharges"], searchTerms: ["pulsatilla", "nigricans", "puls"] },
  { id: 154, name: "Pyrogen", fullName: "Pyrogenium", alternativeNames: ["Pyrog"], category: "potentized", commonUses: ["septic fever", "bed feels hard"], searchTerms: ["pyrogen", "pyrogenium", "pyrog"] },
  { id: 155, name: "Pyrogenium", fullName: "Pyrogenium", alternativeNames: ["Pyrog"], category: "potentized", commonUses: ["septic conditions", "restlessness"], searchTerms: ["pyrogenium", "pyrog"] },
  { id: 156, name: "Ranunculus bulb", fullName: "Ranunculus Bulbosus", alternativeNames: ["Ran-b"], category: "potentized", commonUses: ["intercostal neuralgia", "skin eruptions"], searchTerms: ["ranunculus", "bulbosus", "ran-b"] },
  { id: 157, name: "Ranunculus Bulbosus", fullName: "Ranunculus Bulbosus", alternativeNames: ["Ran-b"], category: "potentized", commonUses: ["chest pain", "herpes"], searchTerms: ["ranunculus", "bulbosus", "ran-b"] },
  { id: 158, name: "Rhatnia", fullName: "Rhatania", alternativeNames: ["Rat"], category: "potentized", commonUses: ["hemorrhoids", "fissures"], searchTerms: ["rhatania", "rat"] },
  { id: 159, name: "Rhus tox", fullName: "Rhus Toxicodendron", alternativeNames: ["Rhus-t"], category: "potentized", commonUses: ["joint stiffness", "better motion", "skin eruptions"], searchTerms: ["rhus", "toxicodendron", "rhus-t"] },
  { id: 160, name: "Rhododendron", fullName: "Rhododendron Chrysanthum", alternativeNames: ["Rhod"], category: "potentized", commonUses: ["rheumatism", "weather changes"], searchTerms: ["rhododendron", "chrysanthum", "rhod"] },
  { id: 161, name: "Robina", fullName: "Robinia Pseudacacia", alternativeNames: ["Rob"], category: "potentized", commonUses: ["acidity", "heartburn"], searchTerms: ["robinia", "pseudacacia", "rob"] },
  { id: 162, name: "Ruta gr", fullName: "Ruta Graveolens", alternativeNames: ["Ruta"], category: "potentized", commonUses: ["eye strain", "tendon injuries"], searchTerms: ["ruta", "graveolens"] },
  { id: 163, name: "Rumex crispus", fullName: "Rumex Crispus", alternativeNames: ["Rumx"], category: "potentized", commonUses: ["cough", "skin problems"], searchTerms: ["rumex", "crispus", "rumx"] },
  { id: 164, name: "Sabal serrulata", fullName: "Sabal Serrulata", alternativeNames: ["Sabal"], category: "potentized", commonUses: ["prostate problems", "urinary issues"], searchTerms: ["sabal", "serrulata"] },
  { id: 165, name: "Sabina", fullName: "Sabina", alternativeNames: ["Sabin"], category: "potentized", commonUses: ["women's bleeding", "miscarriage"], searchTerms: ["sabina", "sabin"] },
  { id: 166, name: "Sangunaria", fullName: "Sanguinaria Canadensis", alternativeNames: ["Sang"], category: "potentized", commonUses: ["migraine", "right-sided headache"], searchTerms: ["sanguinaria", "canadensis", "sang"] },
  { id: 167, name: "Sarsaprilla", fullName: "Sarsaparilla", alternativeNames: ["Sars"], category: "potentized", commonUses: ["kidney stones", "urinary problems"], searchTerms: ["sarsaparilla", "sars"] },
  { id: 168, name: "Selenium", fullName: "Selenium", alternativeNames: ["Sel"], category: "potentized", commonUses: ["weakness", "hair loss"], searchTerms: ["selenium", "sel"] },
  { id: 169, name: "Secale cor", fullName: "Secale Cornutum", alternativeNames: ["Sec"], category: "potentized", commonUses: ["circulation problems", "gangrene"], searchTerms: ["secale", "cornutum", "sec"] },
  { id: 170, name: "Senecio aureus", fullName: "Senecio Aureus", alternativeNames: ["Senec"], category: "potentized", commonUses: ["women's problems", "urinary issues"], searchTerms: ["senecio", "aureus", "senec"] },
  { id: 171, name: "Sepia", fullName: "Sepia Officinalis", alternativeNames: ["Sep"], category: "potentized", commonUses: ["women's hormonal problems", "bearing down pains"], searchTerms: ["sepia", "officinalis", "sep"] },
  { id: 172, name: "Silicea", fullName: "Silicea Terra", alternativeNames: ["Sil"], category: "potentized", commonUses: ["slow healing", "foreign body sensation"], searchTerms: ["silicea", "terra", "sil"] },
  { id: 173, name: "Spongia tosta", fullName: "Spongia Tosta", alternativeNames: ["Spong"], category: "potentized", commonUses: ["dry cough", "heart problems"], searchTerms: ["spongia", "tosta", "spong"] },
  { id: 174, name: "Spigellia", fullName: "Spigelia Anthelmia", alternativeNames: ["Spig"], category: "potentized", commonUses: ["heart problems", "eye pain"], searchTerms: ["spigelia", "anthelmia", "spig"] },
  { id: 175, name: "Staph", fullName: "Staphisagria", alternativeNames: ["Staph"], category: "potentized", commonUses: ["surgical wounds", "suppressed anger"], searchTerms: ["staphisagria", "staph"] },
  { id: 176, name: "Staphisagria", fullName: "Staphisagria", alternativeNames: ["Staph"], category: "potentized", commonUses: ["indignation", "urinary problems"], searchTerms: ["staphisagria", "staph"] },
  { id: 177, name: "Stramonium", fullName: "Stramonium", alternativeNames: ["Stram"], category: "potentized", commonUses: ["delirium", "fears"], searchTerms: ["stramonium", "stram"] },
  { id: 178, name: "Stannum", fullName: "Stannum Metallicum", alternativeNames: ["Stann"], category: "potentized", commonUses: ["weakness", "respiratory problems"], searchTerms: ["stannum", "metallicum", "stann"] },
  { id: 179, name: "Sulphur", fullName: "Sulphur", alternativeNames: ["Sulph"], category: "potentized", commonUses: ["burning sensations", "skin problems", "philosophical mind"], searchTerms: ["sulphur", "sulph"] },
  { id: 180, name: "Sulphuric acid", fullName: "Sulphuricum Acidum", alternativeNames: ["Sul-ac"], category: "potentized", commonUses: ["weakness", "tremors"], searchTerms: ["sulphuric", "acidum", "sul-ac"] },
  { id: 181, name: "Symphytum", fullName: "Symphytum Officinale", alternativeNames: ["Symph"], category: "potentized", commonUses: ["bone injuries", "fractures"], searchTerms: ["symphytum", "officinale", "symph"] },
  { id: 182, name: "Syphilinum", fullName: "Syphilinum", alternativeNames: ["Syph"], category: "potentized", commonUses: ["syphilitic miasm", "bone pains"], searchTerms: ["syphilinum", "syph"] },
  { id: 183, name: "Teucrium", fullName: "Teucrium Marum Verum", alternativeNames: ["Teucr"], category: "potentized", commonUses: ["nasal polyps", "rectal problems"], searchTerms: ["teucrium", "marum", "verum", "teucr"] },
  { id: 184, name: "Tellurium", fullName: "Tellurium", alternativeNames: ["Tell"], category: "potentized", commonUses: ["skin problems", "offensive odor"], searchTerms: ["tellurium", "tell"] },
  { id: 185, name: "Thuja occidentalis", fullName: "Thuja Occidentalis", alternativeNames: ["Thuj"], category: "potentized", commonUses: ["warts", "vaccination effects"], searchTerms: ["thuja", "occidentalis", "thuj"] },
  { id: 186, name: "Tabacum", fullName: "Tabacum", alternativeNames: ["Tab"], category: "potentized", commonUses: ["nausea", "motion sickness"], searchTerms: ["tabacum", "tab"] },
  { id: 187, name: "Tarentula", fullName: "Tarentula Hispanica", alternativeNames: ["Tarent"], category: "potentized", commonUses: ["restlessness", "chorea"], searchTerms: ["tarentula", "hispanica", "tarent"] },
  { id: 188, name: "Terebinthina", fullName: "Terebinthina", alternativeNames: ["Ter"], category: "potentized", commonUses: ["kidney problems", "hemorrhage"], searchTerms: ["terebinthina", "ter"] },
  { id: 189, name: "Thyroidinum", fullName: "Thyroidinum", alternativeNames: ["Thyr"], category: "potentized", commonUses: ["thyroid problems", "obesity"], searchTerms: ["thyroidinum", "thyr"] },
  { id: 190, name: "Trillium pendulum", fullName: "Trillium Pendulum", alternativeNames: ["Trill"], category: "potentized", commonUses: ["bleeding", "women's problems"], searchTerms: ["trillium", "pendulum", "trill"] },
  { id: 191, name: "Trombidium", fullName: "Trombidium", alternativeNames: ["Tromb"], category: "potentized", commonUses: ["skin problems", "itching"], searchTerms: ["trombidium", "tromb"] },
  { id: 192, name: "Tuberculinum", fullName: "Tuberculinum", alternativeNames: ["Tub"], category: "potentized", commonUses: ["tuberculosis miasm", "respiratory problems"], searchTerms: ["tuberculinum", "tub"] },
  { id: 193, name: "Urtica urens", fullName: "Urtica Urens", alternativeNames: ["Urt-u"], category: "potentized", commonUses: ["burns", "skin eruptions"], searchTerms: ["urtica", "urens", "urt-u"] },
  { id: 194, name: "Uran Nit", fullName: "Uranium Nitricum", alternativeNames: ["Uran-n"], category: "potentized", commonUses: ["diabetes", "kidney problems"], searchTerms: ["uranium", "nitricum", "uran-n"] },
  { id: 195, name: "Ustilago", fullName: "Ustilago Maidis", alternativeNames: ["Ust"], category: "potentized", commonUses: ["women's bleeding", "ovarian problems"], searchTerms: ["ustilago", "maidis", "ust"] },
  { id: 196, name: "Verat alb", fullName: "Veratrum Album", alternativeNames: ["Verat"], category: "potentized", commonUses: ["collapse", "cholera"], searchTerms: ["veratrum", "album", "verat"] },
  { id: 197, name: "Virat viride", fullName: "Veratrum Viride", alternativeNames: ["Verat-v"], category: "potentized", commonUses: ["high blood pressure", "congestion"], searchTerms: ["veratrum", "viride", "verat-v"] },
  { id: 198, name: "Vipera tor", fullName: "Vipera Torva", alternativeNames: ["Vip"], category: "potentized", commonUses: ["varicose veins", "phlebitis"], searchTerms: ["vipera", "torva", "vip"] },
  { id: 199, name: "Viburnum opulus", fullName: "Viburnum Opulus", alternativeNames: ["Vib"], category: "potentized", commonUses: ["women's cramps", "ovarian pain"], searchTerms: ["viburnum", "opulus", "vib"] },
  { id: 200, name: "Viscum album", fullName: "Viscum Album", alternativeNames: ["Visc"], category: "potentized", commonUses: ["hypertension", "epilepsy"], searchTerms: ["viscum", "album", "visc"] },
  { id: 201, name: "Wyethia", fullName: "Wyethia Helenioides", alternativeNames: ["Wye"], category: "potentized", commonUses: ["throat irritation", "hay fever"], searchTerms: ["wyethia", "helenioides", "wye"] },
  { id: 202, name: "Zinc met", fullName: "Zincum Metallicum", alternativeNames: ["Zinc"], category: "potentized", commonUses: ["restless legs", "weakness"], searchTerms: ["zincum", "metallicum", "zinc"] },
  { id: 203, name: "Zinc phos", fullName: "Zincum Phosphoricum", alternativeNames: ["Zinc-p"], category: "potentized", commonUses: ["brain fatigue", "neuralgia"], searchTerms: ["zincum", "phosphoricum", "zinc-p"] },

  // List B - Mother Tinctures (marked with category)
  { id: 204, name: "Acalypha India Q", fullName: "Acalypha Indica Mother Tincture", alternativeNames: ["Acalypha Q"], category: "mother_tincture", commonUses: ["cough", "respiratory problems"], searchTerms: ["acalypha", "indica", "mother tincture", "q"] },
  { id: 205, name: "Bluniea Odorata Q", fullName: "Bluniea Odorata Mother Tincture", alternativeNames: ["Bluniea Q"], category: "mother_tincture", commonUses: ["skin problems"], searchTerms: ["bluniea", "odorata", "mother tincture", "q"] },
  
  // List C - Biochemic (Tissue Salts)
  { id: 250, name: "Kali Phos 6x", fullName: "Kali Phosphoricum 6x", alternativeNames: ["Kali Phos"], category: "biochemic", commonUses: ["nerve weakness", "mental fatigue"], searchTerms: ["kali", "phosphoricum", "6x", "12x", "tissue salt"] },
  { id: 251, name: "Calc Phos 6x", fullName: "Calcarea Phosphorica 6x", alternativeNames: ["Calc Phos"], category: "biochemic", commonUses: ["bone development", "teething"], searchTerms: ["calcarea", "phosphorica", "6x", "12x", "tissue salt"] },
  { id: 252, name: "Nat Phos 6x", fullName: "Natrum Phosphoricum 6x", alternativeNames: ["Nat Phos"], category: "biochemic", commonUses: ["acidity", "rheumatism"], searchTerms: ["natrum", "phosphoricum", "6x", "12x", "tissue salt"] },
  { id: 253, name: "Ferrum Phos 6x", fullName: "Ferrum Phosphoricum 6x", alternativeNames: ["Ferr Phos"], category: "biochemic", commonUses: ["fever", "inflammation"], searchTerms: ["ferrum", "phosphoricum", "6x", "12x", "tissue salt"] },
  { id: 254, name: "Mag Phos 6x", fullName: "Magnesia Phosphorica 6x", alternativeNames: ["Mag Phos"], category: "biochemic", commonUses: ["cramps", "spasms"], searchTerms: ["magnesia", "phosphorica", "6x", "12x", "tissue salt"] },
  { id: 255, name: "Silicea 6x", fullName: "Silicea 6x", alternativeNames: ["Sil"], category: "biochemic", commonUses: ["suppuration", "nail problems"], searchTerms: ["silicea", "6x", "12x", "tissue salt"] },
  { id: 256, name: "Kali Mur 6x", fullName: "Kali Muriaticum 6x", alternativeNames: ["Kali Mur"], category: "biochemic", commonUses: ["white discharges", "glandular swelling"], searchTerms: ["kali", "muriaticum", "6x", "12x", "tissue salt"] },
  { id: 257, name: "Nat Mur 6x", fullName: "Natrum Muriaticum 6x", alternativeNames: ["Nat Mur"], category: "biochemic", commonUses: ["water balance", "grief"], searchTerms: ["natrum", "muriaticum", "6x", "12x", "tissue salt"] },
  { id: 258, name: "Kali Sulph 6x", fullName: "Kali Sulphuricum 6x", alternativeNames: ["Kali Sulph"], category: "biochemic", commonUses: ["skin conditions", "yellow discharges"], searchTerms: ["kali", "sulphuricum", "6x", "12x", "tissue salt"] },
  { id: 259, name: "Nat Sulph 6x", fullName: "Natrum Sulphuricum 6x", alternativeNames: ["Nat Sulph"], category: "biochemic", commonUses: ["liver problems", "asthma"], searchTerms: ["natrum", "sulphuricum", "6x", "12x", "tissue salt"] },
  { id: 260, name: "Calc Sulph 6x", fullName: "Calcarea Sulphurica 6x", alternativeNames: ["Calc Sulph"], category: "biochemic", commonUses: ["suppuration", "slow healing wounds"], searchTerms: ["calcarea", "sulphurica", "6x", "12x", "tissue salt"] },
  { id: 261, name: "Mag Sulph 6x", fullName: "Magnesia Sulphurica 6x", alternativeNames: ["Mag Sulph"], category: "biochemic", commonUses: ["digestive problems"], searchTerms: ["magnesia", "sulphurica", "6x", "12x", "tissue salt"] }
];

// Function to search medicines for autosuggestions
export function searchMedicines(query: string, limit: number = 10): HomeopathicMedicine[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (normalizedQuery.length < 2) return [];
  
  const matches = HOMEOPATHIC_MEDICINES.filter(medicine => {
    // Search in main name
    if (medicine.name.toLowerCase().includes(normalizedQuery)) return true;
    
    // Search in full name
    if (medicine.fullName.toLowerCase().includes(normalizedQuery)) return true;
    
    // Search in alternative names
    if (medicine.alternativeNames.some(alt => alt.toLowerCase().includes(normalizedQuery))) return true;
    
    // Search in search terms
    if (medicine.searchTerms.some(term => term.includes(normalizedQuery))) return true;
    
    return false;
  });
  
  // Sort by relevance (exact matches first, then partial matches)
  return matches
    .sort((a, b) => {
      const aExact = a.name.toLowerCase() === normalizedQuery ? 1 : 0;
      const bExact = b.name.toLowerCase() === normalizedQuery ? 1 : 0;
      return bExact - aExact;
    })
    .slice(0, limit);
}

// Function to get medicine by name for AI suggestions
export function getMedicineByName(name: string): HomeopathicMedicine | undefined {
  const normalizedName = name.toLowerCase();
  return HOMEOPATHIC_MEDICINES.find(medicine => 
    medicine.name.toLowerCase() === normalizedName ||
    medicine.fullName.toLowerCase() === normalizedName ||
    medicine.alternativeNames.some(alt => alt.toLowerCase() === normalizedName)
  );
}