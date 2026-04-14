const https = require("https");
const http = require("http");
const { URL } = require("url");

// 👉 Paste your full array here
const data = [
  {
    name: "Apple",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/400px-Red_Apple.jpg",
  },
  {
    name: "Banana",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Cavendish_banana_DS.jpg/400px-Cavendish_banana_DS.jpg",
  },
  {
    name: "Mango",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Hapus_Mango.jpg/400px-Hapus_Mango.jpg",
  },
  {
    name: "Orange",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Oranges_and_orange_juice.jpg/400px-Oranges_and_orange_juice.jpg",
  },
  {
    name: "Strawberry",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/PerfectStrawberry.jpg/400px-PerfectStrawberry.jpg",
  },
  {
    name: "Grapes",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Kyoho-grape.jpg/400px-Kyoho-grape.jpg",
  },
  {
    name: "Pineapple",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Pineapple_and_cross_section.jpg/400px-Pineapple_and_cross_section.jpg",
  },
  {
    name: "Watermelon",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Watermelon_seedless_%28Citrullus_lanatus%29.jpg/400px-Watermelon_seedless_%28Citrullus_lanatus%29.jpg",
  },
  {
    name: "Lemon",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Lemon-Whole-Split.jpg/400px-Lemon-Whole-Split.jpg",
  },
  {
    name: "Lime",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Limes.jpg/400px-Limes.jpg",
  },
  {
    name: "Peach",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Autumn_Red_peaches.jpg/400px-Autumn_Red_peaches.jpg",
  },
  {
    name: "Pear",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/A_pear.jpg/400px-A_pear.jpg",
  },
  {
    name: "Cherry",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Cherry_Stella444.jpg/400px-Cherry_Stella444.jpg",
  },
  {
    name: "Plum",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Plum_on_a_white_background.jpg/400px-Plum_on_a_white_background.jpg",
  },
  {
    name: "Kiwi",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Kiwi_-_Whole_and_Split.jpg/400px-Kiwi_-_Whole_and_Split.jpg",
  },
  {
    name: "Blueberry",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Blueberries.jpg/400px-Blueberries.jpg",
  },
  {
    name: "Raspberry",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Raspberry_-_whole_%28Rubus_idaeus%29.jpg/400px-Raspberry_-_whole_%28Rubus_idaeus%29.jpg",
  },
  {
    name: "Blackberry",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Blackberry_fruit.JPG/400px-Blackberry_fruit.JPG",
  },
  {
    name: "Pomegranate",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Pomegranate_fruit_-_whole_and_open.jpg/400px-Pomegranate_fruit_-_whole_and_open.jpg",
  },
  {
    name: "Papaya",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Papaya_growing_on_a_tree.jpg/400px-Papaya_growing_on_a_tree.jpg",
  },
  {
    name: "Coconut",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Coconut_on_white.jpg/400px-Coconut_on_white.jpg",
  },
  {
    name: "Avocado",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Avocado_on_White_Background.jpg/400px-Avocado_on_White_Background.jpg",
  },
  {
    name: "Fig",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Ficus_carica_-_fruit.jpg/400px-Ficus_carica_-_fruit.jpg",
  },
  {
    name: "Guava",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Guava_ID.jpg/400px-Guava_ID.jpg",
  },
  {
    name: "Lychee",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Lychee_-_single.jpg/400px-Lychee_-_single.jpg",
  },
  {
    name: "Persimmon",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Diospyros_kaki_fruits_2.jpg/400px-Diospyros_kaki_fruits_2.jpg",
  },
  {
    name: "Apricot",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Apricot_and_cross_section.jpg/400px-Apricot_and_cross_section.jpg",
  },
  {
    name: "Nectarine",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Nectarines_-_whole_and_halved.jpg/400px-Nectarines_-_whole_and_halved.jpg",
  },
  {
    name: "Cantaloupe",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Musk_melon_-_whole_and_section.jpg/400px-Musk_melon_-_whole_and_section.jpg",
  },
  {
    name: "Honeydew",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Honeydew.jpg/400px-Honeydew.jpg",
  },
  {
    name: "Tangerine",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Clementine%2C_cross_section_and_whole.jpg/400px-Clementine%2C_cross_section_and_whole.jpg",
  },
  {
    name: "Grapefruit",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Grapefruit_halved.jpg/400px-Grapefruit_halved.jpg",
  },
  {
    name: "Passion Fruit",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PassionFruit.jpg/400px-PassionFruit.jpg",
  },
  {
    name: "Dragon Fruit",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Pitaya_cross_section_ed2.jpg/400px-Pitaya_cross_section_ed2.jpg",
  },
  {
    name: "Jackfruit",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Jackfruit_hanging.jpg/400px-Jackfruit_hanging.jpg",
  },
  {
    name: "Durian",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Durian.jpg/400px-Durian.jpg",
  },
  {
    name: "Star Fruit",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Averrhoa_carambola.jpg/400px-Averrhoa_carambola.jpg",
  },
  {
    name: "Tamarind",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Tamarindus_indica_-_fruits.jpg/400px-Tamarindus_indica_-_fruits.jpg",
  },
  {
    name: "Soursop",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Annona_muricata_fruit.jpg/400px-Annona_muricata_fruit.jpg",
  },
  {
    name: "Rambutan",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Rambutan-2-bunch.jpg/400px-Rambutan-2-bunch.jpg",
  },
  {
    name: "Mangosteen",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Mangosteen_-_2.jpg/400px-Mangosteen_-_2.jpg",
  },
  {
    name: "Longan",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Longan_-_fruits.jpg/400px-Longan_-_fruits.jpg",
  },
  {
    name: "Quince",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Cydonia_oblonga_-_fruits.JPG/400px-Cydonia_oblonga_-_fruits.JPG",
  },
  {
    name: "Mulberry",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Morus_nigra.jpg/400px-Morus_nigra.jpg",
  },
  {
    name: "Gooseberry",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Gooseberry.jpg/400px-Gooseberry.jpg",
  },
  {
    name: "Cranberry",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Cranberries.jpg/400px-Cranberries.jpg",
  },
  {
    name: "Elderberry",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Elderberries_on_a_bush.jpg/400px-Elderberries_on_a_bush.jpg",
  },
  {
    name: "Kumquat",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Fortunella_japonica.jpg/400px-Fortunella_japonica.jpg",
  },
  {
    name: "Plantain",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Plaintain.jpg/400px-Plaintain.jpg",
  },
  {
    name: "Breadfruit",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Breadfruit_Artocarpus_altilis.jpg/400px-Breadfruit_Artocarpus_altilis.jpg",
  },
  {
    name: "Sapodilla",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Chickoo_on_tree.jpg/400px-Chickoo_on_tree.jpg",
  },
  {
    name: "Carambola",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Averrhoa_carambola_-_whole.jpg/400px-Averrhoa_carambola_-_whole.jpg",
  },
  {
    name: "Feijoa",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Feijoa.jpg/400px-Feijoa.jpg",
  },
  {
    name: "Loquat",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Loquat_-_Eriobotrya_japonica.jpg/400px-Loquat_-_Eriobotrya_japonica.jpg",
  },
  {
    name: "Date",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Phoenix_dactylifera_-_fruits.jpg/400px-Phoenix_dactylifera_-_fruits.jpg",
  },
  {
    name: "Olive",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Olives_in_bowl.jpg/400px-Olives_in_bowl.jpg",
  },
  {
    name: "Grape Tomato",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/400px-Tomato_je.jpg",
  },
  {
    name: "Tomato",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Bright_red_tomato_and_cross_section04.jpg/400px-Bright_red_tomato_and_cross_section04.jpg",
  },
  {
    name: "Cacao",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Cacao-pod-k4600.jpg/400px-Cacao-pod-k4600.jpg",
  },
  {
    name: "Clementine",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Clementine.jpg/400px-Clementine.jpg",
  },
  {
    name: "Mandarin",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Citrus_reticulata_%28ripe%29.jpg/400px-Citrus_reticulata_%28ripe%29.jpg",
  },
  {
    name: "Blood Orange",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Moro_Blood_Orange.jpg/400px-Moro_Blood_Orange.jpg",
  },
  {
    name: "Ugli Fruit",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Ugli_fruit.jpg/400px-Ugli_fruit.jpg",
  },
  {
    name: "Yuzu",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Yuzu_citrus_fruit.jpg/400px-Yuzu_citrus_fruit.jpg",
  },
  {
    name: "Pomelo",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Pomelo-separated.jpg/400px-Pomelo-separated.jpg",
  },
  {
    name: "Finger Lime",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Microcitrus_australasica_caviar.jpg/400px-Microcitrus_australasica_caviar.jpg",
  },
  {
    name: "Buddha's Hand",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Buddhas_hand.JPG/400px-Buddhas_hand.JPG",
  },
  {
    name: "Damson",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Prunus_domestica_subsp._insititia_Damson_2016.jpg/400px-Prunus_domestica_subsp._insititia_Damson_2016.jpg",
  },
  {
    name: "Currant",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Red_Currant.jpg/400px-Red_Currant.jpg",
  },
  {
    name: "Boysenberry",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Boysenberry.jpg/400px-Boysenberry.jpg",
  },
  {
    name: "Loganberry",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Loganberry.jpg/400px-Loganberry.jpg",
  },
  {
    name: "Cloudberry",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Rubus_chamaemorus1.jpg/400px-Rubus_chamaemorus1.jpg",
  },
  {
    name: "Dewberry",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Rubus_caesius.jpg/400px-Rubus_caesius.jpg",
  },
  {
    name: "Huckleberry",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Gaylussacia_baccata.jpg/400px-Gaylussacia_baccata.jpg",
  },
  {
    name: "Serviceberry",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Amelanchier_berries.jpg/400px-Amelanchier_berries.jpg",
  },
  {
    name: "Barberry",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Berberis_vulgaris_detail.jpg/400px-Berberis_vulgaris_detail.jpg",
  },
  {
    name: "Acai",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/A%C3%A7a%C3%AD_fruits_Euterpe_oleracea.jpg/400px-A%C3%A7a%C3%AD_fruits_Euterpe_oleracea.jpg",
  },
  {
    name: "Jujube",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Ziziphus_jujuba_fruit.jpg/400px-Ziziphus_jujuba_fruit.jpg",
  },
  {
    name: "Bilberry",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Vaccinium_myrtillus_-_bilberries.jpg/400px-Vaccinium_myrtillus_-_bilberries.jpg",
  },
  {
    name: "Hawthorn",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Crataegus_monogyna_-_berries.jpg/400px-Crataegus_monogyna_-_berries.jpg",
  },
  {
    name: "Salak",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Salak_-_Salacca_zalacca.jpg/400px-Salak_-_Salacca_zalacca.jpg",
  },
  {
    name: "Jaboticaba",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Jaboticaba_-_Plinia_cauliflora.jpg/400px-Jaboticaba_-_Plinia_cauliflora.jpg",
  },
  {
    name: "Ackee",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Blighia_sapida_fruit.jpg/400px-Blighia_sapida_fruit.jpg",
  },
  {
    name: "Bael",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Bael_Aegle_marmelos.jpg/400px-Bael_Aegle_marmelos.jpg",
  },
  {
    name: "Carissa",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Carissa_macrocarpa_-_natal_plum.jpg/400px-Carissa_macrocarpa_-_natal_plum.jpg",
  },
  {
    name: "Cupuacu",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Cupuacu_fruit.jpg/400px-Cupuacu_fruit.jpg",
  },
  {
    name: "Noni",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Noni_Fruit_Morinda_citrifolia.jpg/400px-Noni_Fruit_Morinda_citrifolia.jpg",
  },
  {
    name: "Pepino",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Solanum_muricatum_-_fruits.jpg/400px-Solanum_muricatum_-_fruits.jpg",
  },
  {
    name: "Rollinia",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Rollinia_deliciosa.jpg/400px-Rollinia_deliciosa.jpg",
  },
  {
    name: "Santol",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Sandoricum_koetjape_fruit.jpg/400px-Sandoricum_koetjape_fruit.jpg",
  },
  {
    name: "Wampee",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Clausena_lansium_fruits.jpg/400px-Clausena_lansium_fruits.jpg",
  },
  {
    name: "Miracle Fruit",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Miracle_fruit_-_Synsepalum_dulcificum.jpg/400px-Miracle_fruit_-_Synsepalum_dulcificum.jpg",
  },
  {
    name: "Pummelo",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Pomelo-separated.jpg/400px-Pomelo-separated.jpg",
  },
  {
    name: "Cherimoya",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Chirimoya.jpg/400px-Chirimoya.jpg",
  },
  {
    name: "Mamey Sapote",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Mamey_Sapote_Fruit.jpg/400px-Mamey_Sapote_Fruit.jpg",
  },
  {
    name: "Canistel",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Pouteria_campechiana_-_canistel_fruit.jpg/400px-Pouteria_campechiana_-_canistel_fruit.jpg",
  },
  {
    name: "Abiu",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Pouteria_caimito_-_abiu.jpg/400px-Pouteria_caimito_-_abiu.jpg",
  },
  {
    name: "Lucuma",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Lucuma_-_Pouteria_lucuma.jpg/400px-Lucuma_-_Pouteria_lucuma.jpg",
  },
  {
    name: "Marang",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Artocarpus_odoratissimus_fruits.jpg/400px-Artocarpus_odoratissimus_fruits.jpg",
  },
  {
    name: "Langsat",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Lansium_domesticum.jpg/400px-Lansium_domesticum.jpg",
  },
];

// Check URL (HEAD request)
function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const lib = parsed.protocol === "https:" ? https : http;

      const req = lib.request(url, { method: "HEAD", timeout: 5000 }, (res) => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 400,
          status: res.statusCode,
        });
      });

      req.on("error", () => resolve({ ok: false, status: "ERROR" }));
      req.on("timeout", () => {
        req.destroy();
        resolve({ ok: false, status: "TIMEOUT" });
      });

      req.end();
    } catch {
      resolve({ ok: false, status: "INVALID URL" });
    }
  });
}

// Wikimedia fallback (remove /thumb/ part)
function fallbackWiki(url) {
  const match = url.match(/commons\/thumb\/(.+?)\/\d+px-.+/);
  if (!match) return null;
  return `https://upload.wikimedia.org/wikipedia/commons/${match[1]}`;
}

(async () => {
  console.log("🔍 Validating URLs...\n");

  const results = await Promise.all(
    data.map(async (item) => {
      let result = await checkUrl(item.imageUrl);

      // If failed → try fallback
      if (!result.ok) {
        const fallback = fallbackWiki(item.imageUrl);

        if (fallback) {
          const retry = await checkUrl(fallback);

          if (retry.ok) {
            console.log(`♻️ FIXED ${item.name}`);
            return {
              ...item,
              imageUrl: fallback,
              status: "FIXED",
            };
          }
        }

        // console.log(`❌ ${item.name} -> ${result.status}`);
        return {
          ...item,
          status: `FAIL (${result.status})`,
        };
      }

      // console.log(`✅ ${item.name}`);
      return {
        ...item,
        status: "OK",
      };
    }),
  );

  // Only keep working + fixed URLs

  // console.log("\n--- SUMMARY ---");
  // console.log("Total:", results.length);
  // console.log("OK:", results.length - failed.length - fixed.length);
  // console.log("Fixed:", fixed.length);
  // console.log("Failed:", failed.length);

  // Output clean dataset (only working URLs)
  const cleanData = results.map(({ name, imageUrl }) => ({
    name,
    imageUrl,
  }));

  // console.log("\n--- CLEAN DATA (copy this) ---\n");
  console.log(JSON.stringify(cleanData, null, 2));

  // if (failed.length) {
  //   console.log("\n--- STILL BROKEN ---");
  //   failed.forEach((f) => console.log(`${f.name} -> ${f.imageUrl}`));
  // }
})();
