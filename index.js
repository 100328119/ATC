// application execution file

//import infrastructure package
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars').create({defaultLayout:'main'});
const Twitter = require('twitter');
const app = express();
const Classifier = require("./classifier/classifier");
let classifier = new Classifier();
let lang = new Classifier();
//handlebars front end framework
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//frontend middleware
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

app.get('/',(req, res, next)=>{
  res.render('lang_classifier');
});

app.post('/lang', (req, res, next)=>{
  // console.log(req.body.lang);
  var cate = lang.classifiy(req.body.data);
  console.log(cate)
   return res.send(cate);
});

app.post('/twitter', (req, res, next)=>{
  var user = req.body.user;
  console.log(user);
  var params = {
    screen_name:req.body.user,
    count: 10
  };

  client.get('statuses/user_timeline', params , function(err, data, response) {
     // If there is no error, proceed
     if(!err){
        var tweets = [];
       for(var i = 0; i<data.length; i++){
         // console.log(data[i].text);
          var tweet ={};
          var cate = classifier.classifiy(data[i].text);
          tweet.text = data[i].text;
          tweet.class = cate;
          tweets.push(tweet);
       }
        return res.send(tweets);
     } else {
       console.log(err);
       return res.sendStatus(400);
     }
   })
})
var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});


var business = {
    q: '#business',
    count: 100,
    result_type: 'recent',
    lang: 'en',
    cate:"business"
  };
var life =   {
    q: '#life',
    count: 100,
    result_type: 'recent',
    lang: 'en',
    cate:"life"
  };
var technology =  {
    q: '#technology',
    count: 100,
    result_type: 'recent',
    lang: 'en',
    cate:"technology"
  };
var social =  {
    q: '#social',
    count: 100,
    result_type: 'recent',
    lang: 'en',
    cate:"social"
  };
var entertainment =   {
    q: '#entertainment',
    count: 100,
    result_type: 'recent',
    lang: 'en',
    cate:'entertainment'
  }

client.get('search/tweets', business, function(err, data, response){
    if(!err){
      for(let j = 0; j < data.statuses.length; j++){
        classifier.training(data.statuses[j].text+" business", "business");
      }
    }else{
      console.log(err);
    }
});

client.get('search/tweets', life, function(err, data, response){
    if(!err){
      for(let j = 0; j < data.statuses.length; j++){
        classifier.training(data.statuses[j].text+" life", "life");
      }
    }else{
      console.log(err);
    }
});

client.get('search/tweets', social, function(err, data, response){
    if(!err){
      for(let j = 0; j < data.statuses.length; j++){

        classifier.training(data.statuses[j].text+" social", "social");
      }
    }else{
      console.log(err);
    }
});

client.get('search/tweets', entertainment, function(err, data, response){
    if(!err){
      for(let j = 0; j < data.statuses.length; j++){
        classifier.training(data.statuses[j].text+" entertainment", "entertainment");
      }
    }else{
      console.log(err);
    }
});
client.get('search/tweets', technology, function(err, data, response){
    if(!err){
      for(let j = 0; j < data.statuses.length; j++){
        classifier.training(data.statuses[j].text+" technology", "technology");
      }
    }else{
      console.log(err);
    }
});


lang.training("Ce texte est en francais", "fr");
lang.training("Celui ci est aussi en francais", "fr");
lang.training("La nouvelle inattendue a déconcerté tout le monde.", "fr");
lang.training("J'ai versé des larmes de joie en apprenant la nouvelle.", "fr");
lang.training("Je lis le journal pour me tenir informé des dernières nouvelles.", "fr");
lang.training("Il regarde les nouvelles à la télévision.", "fr");
lang.training("Le but d'un journal est de diffuser les informations..", "fr");
lang.training("Elle lit les informations tous les matins dans le journal.", "fr");
lang.training("Les médecines complémentaires et en particulier l’homéopathie sont-elles à un tournant de leur histoire en France ? Saisie cet été par le ministère de la santé sur le sujet des produits homéopathiques, la Haute Autorité de santé (HAS) devrait rendre son verdict d’ici à la fin février 2019 sur le bien-fondé de leur remboursement, actuellement pour certains d’entre eux à hauteur de 30 %. Parallèlement, plusieurs universités, comme celle de Lille ou d’Angers, ont décidé, en septembre, de suspendre leurs diplômes universitaires d’homéopathie.", "fr");
lang.training("La situation est inédite. Jusqu’ici, malgré moult offensives d’une partie du corps médical pointant l’absence de preuves d’efficacité des granules et le statut dérogatoire de leur mise sur le marché, le soufflé était toujours retombé. Un seul ministre de la santé (Jean-François Mattei, en 2003) avait touché au remboursement de ces traitements très populaires, faisant passer la prise en charge de 65 % à 35 %.", "fr");
lang.training("Cette année, nul souci physique pour la demi-centre, leader de l’escouade française. A 29 ans, Allison Pineau est à maturité. De quoi augurer d’un Euro grand cru pour la native de Chartres. D’autant que la compétition est à domicile. Jouer à la maison, pour celle qui a roulé sa bosse un peu partout, est « une chance et un privilège ».", "fr");
lang.training("« Petite dernière » de 18 printemps à l’époque, dans un groupe en fin de course formé par les championnes du monde 2003, la joueuse a depuis mené sa barque jusqu’à Brest, dont elle défend les couleurs depuis deux ans.","fr");
lang.training("Gamine tombée presque par hasard dans le handball – une histoire de taille de mains – la jeune femme est aujourd’hui l’une des taulières de l’équipe de France. Une « titulaire indispensable » que le coach français, Olivier Krumbholz, est assuré d’aligner « à moins qu’elle ne joue à cloche-pied, et encore. »","fr");
lang.training("The unexpected news bewildered everyone.", "en");
lang.training("I shed tears of joy when I heard the news", "en");
lang.training("I read the newspaper to keep up with the latest news.", "en");
lang.training("He is watching the news on the television.", "en");
lang.training("I like to be the bearer of good news.", "en");
lang.training("The goal of a newspaper is to circulate the news.", "en");
lang.training("She reads the news every morning in the newspaper", "en");
lang.training("She reads the news every morning in the newspaper", "en");
lang.training("She reads the news every morning in the newspaper", "en");
lang.training("She reads the news every morning in the newspaper", "en");
lang.training("She reads the news every morning in the newspaper", "en");
lang.training("She reads the news every morning in the newspaper", "en");
lang.training("She reads the news every morning in the newspaper", "en");
lang.training("She reads the news every morning in the newspaper", "en");
lang.training("She reads the news every morning in the newspaper", "en");
lang.training("She reads the news every morning in the newspaper", "en");
lang.training("Republican candidate Brian Kemp currently leads Abrams with 50.3% of the vote. If Kemp's share dips below 50%, the race automatically goes into a run-off on December 4, even if Kemp is the top vote-getter. For now, Kemp's lead stands at nearly 59,000 votes.", "en");
lang.training("In strict legal terms, Russia and Ukraine share access to its waters under a 2003 treaty. This, though, specifically states that warships from third countries can only enter the sea or make port visits there with the express permission of the other party.", "en");
lang.training("It's more likely that Nato might seek to boost its naval deployments to the Black Sea, where its members - Bulgaria, Romania and Turkey - are uneasy about Russia's more assertive behaviour.", "en");
lang.training("Mr Poroshenko has low popularity ratings. Recent polls suggest that only about 10% of the electorate plans to vote for him next year, with nearly 50% saying they would not vote for him under any circumstances, the Kyiv Post newspaper reported.", "en")
lang.training("Mr Putin added that Mr Poroshenko's decision to impose martial law after a mere border incident was extreme, because it was not even imposed during the conflict with pro-Russian separatists in eastern Ukraine in 2014.","en");
// console.log(lang.classifiy('leads Abrams tears of joy every news newspaper english'));

app.set('port', process.env.PORT || 4000);
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate');
})
