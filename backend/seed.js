require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

// 50 general demo products plus 100 Ethiopian cultural sample products.
const items = [
  ["Wireless Headphones","Electronics",1850,18,"Comfortable wireless headphones with clear everyday sound.","photo-1505740420928-5e560c06d30e"],
  ["Bluetooth Speaker","Electronics",1450,14,"Portable speaker for music at home or outdoors.","photo-1608043152269-423dbba4e7e1"],
  ["Smart Watch","Electronics",3200,9,"A modern smartwatch for notifications and daily activity.","photo-1523275335684-37898b6baf30"],
  ["Wireless Mouse","Electronics",650,25,"Ergonomic wireless mouse for work and study.","photo-1527814050087-3793815479db"],
  ["Mechanical Keyboard","Electronics",2400,8,"Responsive keyboard for typing and gaming.","photo-1587829741301-dc798b83add3"],
  ["USB-C Hub","Electronics",1250,12,"Multiport hub for connecting your everyday devices.","photo-1625842268584-8f3296236761"],
  ["Laptop Stand","Electronics",980,16,"Adjustable stand for a more comfortable desk setup.","photo-1527864550417-7fd91fc51a46"],
  ["Power Bank 20000mAh","Electronics",2100,10,"Portable backup power for compatible devices.","photo-1609091839311-d5365f9ff1c5"],
  ["Digital Camera Bag","Accessories",1350,7,"Protective carry bag for camera essentials.","photo-1516035069371-29a1b244cc32"],
  ["LED Desk Light","Home & Living",890,20,"Minimal desk lamp for reading and focused work.","photo-1507473885765-e6ed057f782c"],
  ["Classic Backpack","Fashion",1250,20,"Versatile backpack for school, work and daily use.","photo-1553062407-98eeb64c6a62"],
  ["Canvas Tote Bag","Fashion",420,30,"Reusable everyday tote with a simple design.","photo-1544816155-12df9643f363"],
  ["Casual Sneakers","Fashion",2650,11,"Comfortable casual sneakers for everyday outfits.","photo-1542291026-7eec264c27ff"],
  ["Classic Wristwatch","Accessories",1750,13,"A clean everyday watch with a timeless look.","photo-1524592094714-0f0654e20314"],
  ["Polarized Sunglasses","Accessories",780,19,"Lightweight sunglasses for bright outdoor days.","photo-1511499767150-a48a237f0083"],
  ["Cotton T-Shirt","Fashion",550,35,"Soft cotton basic tee for everyday wear.","photo-1521572163474-6864f9cf17ab"],
  ["Denim Jacket","Fashion",1950,8,"Classic denim layer for casual styling.","photo-1543076447-215ad9ba6923"],
  ["Running Shoes","Sports & Outdoors",2850,10,"Supportive shoes for walking and running.","photo-1460353581641-37baddab0fa2"],
  ["Yoga Mat","Sports & Outdoors",950,17,"Non-slip mat for stretching and yoga practice.","photo-1592432678016-e910b452f9a2"],
  ["Stainless Water Bottle","Sports & Outdoors",480,24,"Reusable bottle for daily hydration.","photo-1602143407151-7111542de6e8"],
  ["Football","Sports & Outdoors",850,15,"Durable football for casual games and practice.","photo-1614632537423-1e6c2e7e0e6f"],
  ["Dumbbell Pair","Sports & Outdoors",1450,6,"Compact hand weights for home exercise.","photo-1583454110551-21f2fa2afe61"],
  ["Ceramic Coffee Mug","Home & Living",280,40,"Simple ceramic mug for coffee and tea.","photo-1514228742587-6b1558fcca3d"],
  ["Modern Wall Clock","Home & Living",760,12,"Minimal wall clock for home or office.","photo-1563861826100-9cb868fdbe1c"],
  ["Decorative Cushion","Home & Living",390,22,"Soft cushion cover to refresh your living space.","photo-1584100936595-c0654b55a2e2"],
  ["Table Organizer","Home & Living",520,14,"Keep stationery and desk accessories organized.","photo-1494438639946-1ebd1d20bf85"],
  ["Bedside Table Lamp","Home & Living",1100,9,"Warm ambient lighting for a bedside table.","photo-1507473885765-e6ed057f782c"],
  ["Storage Basket Set","Home & Living",680,18,"Useful baskets for tidy shelves and rooms.","photo-1593085260707-5377ba37f868"],
  ["Skincare Gift Set","Beauty & Personal Care",1350,10,"A simple skincare gift set for daily care.","photo-1608248543803-ba4f8c70ae0b"],
  ["Face Moisturizer","Beauty & Personal Care",620,21,"Light daily moisturizer for a comfortable feel.","photo-1601049541289-9b1b7bbbfe19"],
  ["Hair Care Kit","Beauty & Personal Care",980,12,"Everyday hair care essentials in one set.","photo-1522335789203-aabd1fc54bc9"],
  ["Makeup Brush Set","Beauty & Personal Care",540,16,"Brush set for makeup application and blending.","photo-1522335789203-aabd1fc54bc9"],
  ["Travel Toiletry Bag","Accessories",470,20,"Compact organizer for travel essentials.","photo-1553062407-98eeb64c6a62"],
  ["Scented Candle","Home & Living",350,26,"A decorative candle for a cozy room atmosphere.","photo-1603006905003-be475563bc59"],
  ["Notebook Bundle","Books & Stationery",280,45,"A bundle of notebooks for notes and planning.","photo-1531346878377-a5be20888e57"],
  ["Hardcover Journal","Books & Stationery",390,30,"Hardcover journal for ideas and daily writing.","photo-1517842645767-c639042777db"],
  ["Fountain Pen","Books & Stationery",720,14,"Classic writing pen for notes and letters.","photo-1583485088034-697b5bc54ccd"],
  ["Desk Planner","Books & Stationery",320,28,"Plan tasks and organize your week.","photo-1506784983877-45594efa4cbe"],
  ["Colored Pencil Set","Books & Stationery",460,19,"Color pencil set for drawing and creative projects.","photo-1513364776144-60967b0f800f"],
  ["Travel Mug","Home & Living",590,18,"Reusable insulated mug for drinks on the go.","photo-1514228742587-6b1558fcca3d"],
  ["Sling Shoulder Bag","Fashion",890,14,"Compact shoulder bag for everyday essentials.","photo-1548036328-c9fa89d128fa"],
  ["Leather Wallet","Accessories",680,17,"Slim wallet for cards and everyday carry.","photo-1627123424574-724758594e93"],
  ["Baseball Cap","Fashion",390,25,"Adjustable cap for casual everyday wear.","photo-1588850561407-ed78c282e89b"],
  ["Phone Protective Case","Accessories",260,35,"Protective phone case with a simple finish.","photo-1601593346740-925612772716"],
  ["Fresh Coffee Beans","Groceries",520,30,"Roasted coffee beans for a fresh cup at home.","photo-1447933601403-0c6688de566e"],
  ["Organic Honey Jar","Groceries",390,22,"Honey for breakfast, drinks and recipes.","photo-1587049352846-4a222e784d38"],
  ["Herbal Tea Collection","Groceries",450,24,"A selection of tea blends for relaxing breaks.","photo-1544787219-7f47ccb76574"],
  ["Reusable Food Containers","Home & Living",640,16,"Reusable containers for kitchen storage.","photo-1490645935967-10de6ba17061"],
  ["Mini First Aid Pouch","Accessories",330,13,"Compact pouch for organizing basic first-aid supplies.","photo-1603398938378-e54eab446dde"],
  ["Bluetooth Earbuds","Electronics",1650,12,"Compact wireless earbuds for everyday listening.","photo-1606220945770-b5b6c2c55bf1"],
  ["Portable Laptop Sleeve","Accessories",750,15,"Padded sleeve for carrying a laptop.","photo-1496181133206-80ce9b88a853"]
];

// 100 Ethiopian cultural products: demonstration catalog spanning crafts, textiles,
// coffee culture, traditional clothing, spices, music and regional food products.
const culturalNames = [
"Ethiopian Coffee Beans","Yirgacheffe Coffee","Sidama Coffee","Harar Coffee","Limu Coffee","Jimma Coffee",
"Traditional Jebena","Coffee Ceremony Set","Handwoven Sini","Coffee Roasting Pan","Coffee Serving Tray","Ethiopian Coffee Cups",
"Habesha Kemis","Men's Ethiopian Cultural Shirt","Tibeb Dress","Netela Scarf","Gabi Traditional Shawl","Kuta Traditional Cloth",
"Handwoven Ethiopian Basket","Mesob Woven Table","Agelgil Basket","Decorative Woven Tray","Traditional Market Basket","Grass Storage Basket",
"Handmade Clay Incense Burner","Traditional Clay Pot","Decorative Ethiopian Pottery","Hand-painted Ceramic Plate","Clay Water Jug",
"Cross Pendant Necklace","Ethiopian Orthodox Cross Replica","Silver Habesha Earrings","Handmade Beaded Necklace","Leather Bracelet",
"Traditional Leather Sandals","Handcrafted Leather Bag","Woven Leather Wallet","Ethiopian Leather Journal","Handmade Leather Belt",
"Traditional Tibeb Headband","Handwoven Cotton Scarf","Tigray Traditional Textile","Oromo Traditional Textile","Amhara Tibeb Fabric",
"Sidama Cultural Cloth","Gurage Traditional Cloth","Wollo Tibeb Shawl","Handwoven Cotton Blanket","Traditional Embroidered Tablecloth",
"Enjera Baking Mitad","Traditional Mitad Accessory","Berbere Spice Blend","Mitmita Spice","Shiro Powder","Korerima Spice",
"Besobela Herb","Ethiopian Black Cumin","Teff Flour","White Teff Grain","Red Teff Grain","Ethiopian Honey",
"Tigray White Honey","Traditional Honey Jar","Roasted Barley Snack","Kolo Snack Mix","Dabo Kolo Snack","Ethiopian Popcorn Spice",
"Traditional Music Krar","Washint Flute Replica","Kebero Drum","Traditional Masenqo Replica","Ethiopian Music Poster",
"Handcrafted Wooden Cross","Decorative Wooden Bowl","Hand-carved Serving Spoon","Traditional Wooden Stool","Handmade Wall Art",
"Ethiopian Map Wall Art","Lalibela Heritage Print","Axum Obelisk Miniature","Rock-Hewn Church Model","Traditional Painting",
"Handmade Paper Notebook","Ethiopian Alphabet Learning Cards","Amharic Calligraphy Print","Ge'ez Script Poster","Ethiopian Storybook",
"Traditional Incense","Frankincense Resin","Myrrh Resin","Handmade Soap with Ethiopian Herbs","Natural Shea Butter",
"Traditional Hair Comb","Handmade Beaded Keychain","Ethiopian Flag Textile","Regional Cultural Gift Box","Ethiopian Artisan Gift Set","Traditional Ethiopian Board Game","Handmade Prayer Mat","Regional Artisan Souvenir"
];
const culturalCategories = ["Coffee & Ceremony","Traditional Clothing","Handwoven Crafts","Pottery & Homeware","Jewelry & Accessories","Leather Crafts","Spices & Food","Traditional Music","Art & Heritage","Books & Gifts"];
const culturalItems = culturalNames.map((name,i)=>[
 name,culturalCategories[i%10],180+((i*137)%3200),8+(i%25),
 `Ethiopian cultural sample product. ${name} represents artisan traditions, regional creativity and local heritage. Demonstration listing; confirm origin, materials and availability with the seller.`,
 ["photo-1447933601403-0c6688de566e","photo-1515886657613-9f3515b0c78f","photo-1493106641515-6b5631de4bb9","photo-1578749556568-bc2c40e68b61","photo-1515562141207-7a88fb7ce338"][i%5]
]);
items.push(...culturalItems);

function brandFor(category){
 const brands={"Electronics":"NovaTech","Fashion":"Urban Thread","Home & Living":"Habesha Home","Beauty & Personal Care":"Luma Care","Books & Stationery":"PaperNest","Sports & Outdoors":"ActiveWay","Groceries":"Highland Select","Accessories":"Daily Essentials"};
 return brands[category]||"EthioMarket Select";
}
(async()=>{
 await mongoose.connect(process.env.MONGODB_URI);
 let added=0;
 for(const [name,category,price,stock,description,photo] of items){
  const image=`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=800&q=80`;
  const result=await Product.updateOne({name},{$set:{name,category,price,stock,description,image,featured:items.findIndex(x=>x[0]===name)<6,
    brand: brandFor(category), sku: `EM-${String(items.findIndex(x=>x[0]===name)+1).padStart(4,"0")}`,
    details: `${name} is a carefully selected ${category.toLowerCase()} item for everyday use. ${description} Check the product photos and specifications before ordering. This is a demonstration listing for the EthioMarket student project.`,
    highlights: [description, `Category: ${category}`, `Available stock: ${stock} units`, "Demo product listing; details may be customized by the store administrator."],
    warranty: "7-day demo store return window", color: "As shown in product image"}},{upsert:true});
  if(result.upsertedCount)added++;
 }
 console.log(`Demo catalog ready. ${added} new products added; ${items.length} sample products are defined.`);
 await mongoose.disconnect();
})().catch(async e=>{console.error(e);await mongoose.disconnect();process.exit(1);});
