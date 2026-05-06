import type { RecipeInput, Category } from '@/types'

export const CATEGORIES: { id: Category | 'todas'; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'entrada', label: 'Entradas' },
  { id: 'principal', label: 'Principales' },
  { id: 'postre', label: 'Postres' },
  { id: 'bebida', label: 'Bebidas' },
  { id: 'salsa', label: 'Salsas' },
]

interface SeedImageRef {
  lang: 'es' | 'en'
  article: string
}

const SEED_IMAGE_ARTICLES: Record<string, SeedImageRef[]> = {
  'Tacos al Pastor': [
    { lang: 'es', article: 'Taco_al_pastor' },
    { lang: 'en', article: 'Al_pastor' },
  ],
  'Guacamole Tradicional': [{ lang: 'es', article: 'Guacamole' }],
  'Pozole Rojo': [{ lang: 'es', article: 'Pozole' }],
  'Enchiladas Verdes': [{ lang: 'es', article: 'Enchilada' }],
  'Chiles en Nogada': [
    { lang: 'es', article: 'Chile_en_nogada' },
    { lang: 'en', article: 'Chiles_en_nogada' },
  ],
  'Salsa Roja Molcajeteada': [
    { lang: 'es', article: 'Pico_de_gallo' },
    { lang: 'es', article: 'Chile_de_árbol' },
  ],
  'Agua de Jamaica': [{ lang: 'es', article: 'Agua_de_Jamaica' }],
  'Flan Napolitano': [{ lang: 'es', article: 'Flan' }],
}

interface MWResponse {
  query?: { pages?: Record<string, { thumbnail?: { source?: string } }> }
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as string)
    r.onerror = () => reject(r.error)
    r.readAsDataURL(blob)
  })
}

async function fetchThumb(ref: SeedImageRef): Promise<string | null> {
  try {
    const api = `https://${ref.lang}.wikipedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(ref.article)}&prop=pageimages&piprop=thumbnail&pithumbsize=800&origin=*`
    const res = await fetch(api)
    if (!res.ok) return null
    const data: MWResponse = await res.json()
    const first = Object.values(data.query?.pages ?? {})[0]
    return first?.thumbnail?.source ?? null
  } catch {
    return null
  }
}

export async function resolveSeedImage(title: string): Promise<string | null> {
  const refs = SEED_IMAGE_ARTICLES[title]
  if (!refs) return null
  for (const ref of refs) {
    const url = await fetchThumb(ref)
    if (!url) continue
    try {
      const imgRes = await fetch(url)
      if (!imgRes.ok) continue
      return await blobToDataURL(await imgRes.blob())
    } catch {
      continue
    }
  }
  return null
}

export const SEED_RECIPES: RecipeInput[] = [
  {
    title: 'Tacos al Pastor',
    description: 'Tacos clásicos de la Ciudad de México con cerdo marinado en achiote y piña.',
    category: 'principal',
    time: 60,
    servings: 4,
    difficulty: 'Media',
    image: null,
    ingredients: [
      '500 g de lomo de cerdo en filetes delgados',
      '3 chiles guajillo sin semillas',
      '2 chiles anchos sin semillas',
      '2 cdas de pasta de achiote',
      '1/4 de piña en rodajas',
      '1/2 cebolla blanca',
      '3 dientes de ajo',
      '1 cdta de comino',
      '1 cdta de orégano mexicano',
      '1/4 taza de vinagre blanco',
      'Tortillas de maíz',
      'Cilantro y cebolla picados',
      'Limones y salsa al gusto',
    ],
    steps: [
      'Hidrata los chiles en agua caliente por 10 minutos.',
      'Licúa los chiles con achiote, ajo, comino, orégano, vinagre y un trozo de piña hasta obtener una marinada espesa.',
      'Cubre los filetes de cerdo con la marinada y refrigera al menos 2 horas (idealmente toda la noche).',
      'Asa los filetes a fuego alto en plancha o sartén hasta dorar; pica finamente.',
      'Asa unas rodajas de piña y pícalas también.',
      'Calienta las tortillas y arma los tacos con la carne, piña, cebolla y cilantro.',
      'Sirve con limón y tu salsa favorita.',
    ],
  },
  {
    title: 'Guacamole Tradicional',
    description: 'El acompañamiento mexicano por excelencia, fresco y cremoso.',
    category: 'entrada',
    time: 10,
    servings: 4,
    difficulty: 'Fácil',
    image: null,
    ingredients: [
      '3 aguacates maduros',
      '1 jitomate picado',
      '1/2 cebolla blanca finamente picada',
      '1 chile serrano picado',
      '1/4 taza de cilantro picado',
      'Jugo de 1 limón',
      'Sal al gusto',
    ],
    steps: [
      'Corta los aguacates por la mitad, retira el hueso y saca la pulpa a un molcajete o tazón.',
      'Machaca ligeramente dejando algunos trozos.',
      'Agrega cebolla, chile, jitomate y cilantro; mezcla suavemente.',
      'Sazona con jugo de limón y sal al gusto.',
      'Sirve de inmediato con totopos.',
    ],
  },
  {
    title: 'Pozole Rojo',
    description: 'Sopa tradicional con maíz pozolero, cerdo y chiles secos. Plato de fiesta.',
    category: 'principal',
    time: 180,
    servings: 6,
    difficulty: 'Media',
    image: null,
    ingredients: [
      '1 kg de maíz pozolero precocido',
      '1 kg de espinazo y maciza de cerdo',
      '1 cabeza de ajo',
      '1 cebolla partida',
      '5 chiles guajillo',
      '3 chiles anchos',
      '2 hojas de laurel',
      'Sal al gusto',
      'Para servir: lechuga rallada, rábanos, cebolla, orégano, limón, tostadas',
    ],
    steps: [
      'Cocina la carne con cebolla, ajo, laurel y sal en abundante agua hasta que esté suave (1.5 h aprox.).',
      'Hidrata los chiles, retira semillas y licúalos con un poco de caldo y ajo. Cuela.',
      'Agrega el maíz pozolero y la salsa de chile al caldo con la carne.',
      'Hierve 30-45 minutos hasta que el maíz reviente y el sabor se concentre.',
      'Ajusta de sal y sirve con los acompañamientos a un costado.',
    ],
  },
  {
    title: 'Enchiladas Verdes',
    description: 'Tortillas rellenas de pollo bañadas en salsa de tomate verde y crema.',
    category: 'principal',
    time: 45,
    servings: 4,
    difficulty: 'Fácil',
    image: null,
    ingredients: [
      '12 tortillas de maíz',
      '2 pechugas de pollo cocidas y deshebradas',
      '8 tomates verdes',
      '2 chiles serranos',
      '1/2 cebolla',
      '2 dientes de ajo',
      '1 manojo de cilantro',
      '1 taza de crema',
      '200 g de queso fresco',
      'Aceite, sal y pimienta',
    ],
    steps: [
      'Hierve los tomates con chiles, cebolla y ajo hasta que cambien de color.',
      'Licúa con el cilantro, sal y un poco del agua de cocción.',
      'Calienta la salsa con un poco de aceite por 5 minutos.',
      'Pasa cada tortilla por aceite caliente para suavizarla, luego por la salsa.',
      'Rellena con pollo deshebrado y enrolla.',
      'Sirve bañadas en más salsa, con crema, queso y aros de cebolla.',
    ],
  },
  {
    title: 'Chiles en Nogada',
    description: 'Plato emblemático de Puebla con los colores de la bandera mexicana.',
    category: 'principal',
    time: 120,
    servings: 6,
    difficulty: 'Difícil',
    image: null,
    ingredients: [
      '6 chiles poblanos asados y pelados',
      '500 g de carne molida (res y cerdo)',
      '1 manzana, 1 pera, 1 durazno (todo en cubitos)',
      '1/2 taza de pasitas',
      '1/4 taza de almendras peladas',
      '1 cebolla y 2 ajos picados',
      '2 jitomates licuados',
      '200 g de nuez de Castilla',
      '100 g de queso de cabra',
      '1 taza de leche, azúcar al gusto',
      'Granada y perejil para decorar',
    ],
    steps: [
      'Sofríe cebolla y ajo, agrega la carne y dora; añade jitomate licuado.',
      'Incorpora las frutas, pasitas y almendras; cocina hasta integrar y reducir.',
      'Rellena los chiles previamente abiertos por un costado.',
      'Para la nogada, licúa la nuez con el queso, leche y un toque de azúcar hasta que quede tersa.',
      'Cubre los chiles con la nogada fría.',
      'Decora con granada y perejil. Sirve a temperatura ambiente.',
    ],
  },
  {
    title: 'Salsa Roja Molcajeteada',
    description: 'Salsa rústica de chile de árbol y jitomate, picosita y muy aromática.',
    category: 'salsa',
    time: 15,
    servings: 6,
    difficulty: 'Fácil',
    image: null,
    ingredients: [
      '4 jitomates',
      '5 chiles de árbol (al gusto)',
      '2 dientes de ajo con cáscara',
      '1/4 cebolla',
      'Sal al gusto',
    ],
    steps: [
      'Asa los jitomates, chiles, ajos y cebolla en un comal hasta que estén tatemados.',
      'Pela los ajos.',
      'Muele en molcajete primero ajo y sal, luego chiles, después jitomates y cebolla.',
      'Ajusta de sal y sirve.',
    ],
  },
  {
    title: 'Agua de Jamaica',
    description: 'Bebida fría refrescante de flor de jamaica, ideal para el calor.',
    category: 'bebida',
    time: 20,
    servings: 6,
    difficulty: 'Fácil',
    image: null,
    ingredients: [
      '1 taza de flor de jamaica seca',
      '2 litros de agua',
      '3/4 taza de azúcar (al gusto)',
      'Hielo',
    ],
    steps: [
      'Hierve 1 litro de agua con la jamaica por 10 minutos.',
      'Cuela y agrega el azúcar mientras esté caliente; mezcla.',
      'Añade el otro litro de agua fría.',
      'Refrigera y sirve con mucho hielo.',
    ],
  },
  {
    title: 'Flan Napolitano',
    description: 'Postre cremoso con caramelo dorado, clásico de las sobremesas mexicanas.',
    category: 'postre',
    time: 90,
    servings: 8,
    difficulty: 'Media',
    image: null,
    ingredients: [
      '1 lata de leche condensada',
      '1 lata de leche evaporada',
      '190 g de queso crema',
      '4 huevos',
      '1 cdta de extracto de vainilla',
      '1 taza de azúcar (para el caramelo)',
    ],
    steps: [
      'Funde el azúcar en un molde a fuego bajo hasta que se caramelice; cubre el fondo.',
      'Licúa los demás ingredientes hasta que quede una mezcla tersa.',
      'Vierte sobre el caramelo.',
      'Hornea a baño maría a 180 °C por 60-70 minutos hasta que cuaje.',
      'Enfría completamente, refrigera 4 horas y desmolda con cuidado.',
    ],
  },
]
