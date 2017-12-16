var fs = require('fs');
var https = require('https');
var HTMLTemplate = require('./template.js');
var districts= ["Agra","Aligarh","Allahabad","Ambedkar Nagar","Amethi","Amroha","Auraiya","Azamgarh","Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti","Bhadohi","Bijnor","Budaun","Bulandshahar","Chandauli","Chitrakoot","Deoria","Etah","Etawah","Faizabad","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kushinagar","Lakhimpur Kheri","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh","Raebareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur","Shamli","Shravasti","Siddharth Nagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi"];
var districtNames = ["आगरा","अलीगढ़","इलाहाबाद","अंबेडकर नगर","अमेठी","अमरोहा","औरैया","आजमगढ़","बागपत","बहराइच","बलिया","बलरामपुर","बांदा","बाराबंकी","बरेली","बस्ती","भदोही","बिजनौर","शाहजहांपुर","बुलंदशहर","चंदौली","चित्रकूट","देवरिया","एटा","इटावा","फैजाबाद","फर्रुखाबाद","फतेहपुर","फिरोजाबाद","गौतम बुद्ध नगर","गाज़ियाबाद","गाजीपुर","गोंडा","गोरखपुर","हमीरपुर","हापुड़","हरदोई","हाथरस","जालौन","जौनपुर","झांसी","कन्नौज","कानपुर देहात","कानपुर नगर","कासगंज","कौशाम्बी","कुशीनगर","लखीमपुर खेरी","ललितपुर","लखनऊ","महाराजगंज","महोबा","मैनपुरी","मथुरा","मऊ","मेरठ","मिर्जापुर","मुरादाबाद","मुजफ्फरनगर","पीलीभीत","प्रतापगढ़","रायबरेली","रामपुर","सहारनपुर","संभल","संत कबीर नगर","शाहजहांपुर","शामली","श्रावस्ती","सिद्धार्थ नगर","सीतापुर","सोनभद्र","सुल्तानपुर","उन्नाव","वाराणसी"];
var count = 0;
for(i in districts){
  let val = districts[i].toLowerCase().split(' ').join('-');
  let district = districts[i];
  let districtName = districtNames[i];
  var dist = "https://cdn.protograph.pykih.com/"+val+"/index.json";
  console.log(dist, ";;;;;")
  https.get(dist, function (response){
    response.on('data',function(chunk){
      var iframes = JSON.parse(chunk.toString());
      var url = "var mode = (window.innerWidth <= 500) ? 'mobile' : 'laptop';\n"
      var divs=""
      for(var j in iframes){
        var indexs=+j+1,
          d = iframes[j];

        if ((d.schema_id === 'c604e96223dd12fbf314') || (d.schema_id === '6ba6a13bf0ccd536d78c')) {
          // url = `var mode${indexs} = (window.innerWidth <= 500) ? 'mobile' : 'laptop_col4';\n`;
          // url += `new ProtoEmbed.initFrame('card-list-div" + indexs + "','" + iframes[+j]["iframe_url"] + "', mode${indexs});\n`;
        } else {
          url+="new ProtoEmbed.initFrame('card-list-div"+indexs+"','"+ iframes[+j]["iframe_url"] + "', mode);\n"
        }

      }
      var data = HTMLTemplate({
        district_name_eng: district,
        district_name: districtName,
        code: url
      })
      fs.writeFileSync('./'+val+'.html', data, 'utf8');
    })
  });
}