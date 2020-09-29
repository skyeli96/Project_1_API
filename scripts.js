var userHistory = [];

var ingredients = [];
var foodInput = $("#foodInput");
var searchHistory = $("#exampleFormControlTextarea1");

$(document).ready(function () {

    var localHistory = JSON.parse(localStorage.getItem("ingredients"));
    console.log(localHistory);

    if (localHistory) {
        userHistory = localHistory;
        searchHistory.val(parseArray(userHistory));
    }


})

//builds url for ajax call
function foodSearchUrl() {

    var appKey = "65bc38bb4c3b484861c57fb9690d8edc";
    var appId = "bb8f4a04";

    var queryUrl = "https://api.edamam.com/search?q=" + ingredients + "&app_id=" + appId + "&app_key=" + appKey + "&from=0&to=20";


    return queryUrl;
}

//dynamically builds 2 card elements on the page
function recipeCard(obj) {

    for (let i = 0; i < 2; i++) {
        var recipe = obj.hits[random(obj.hits.length)].recipe;


        var appendFood = $("#appendFood");

        //jquery commands to create html elements
        var column = $('<div class="col-sm-6">');
        var card = $('<div class="card">');
        var link = $('<a target="_blank">');
        var img = $('<img style="width:100%">');
        var container = $('<div class="container">');
        var recipeName = $('<h4 style="font-weight:bold">');
        var recipeDescription = $('<p style="font-size:15px">');

        var button = $('<button type="button" class="btn btn-primary favourite">');


        //sets the attributes of some of the new elements
        link.attr("href", recipe.url);
        img.attr("src", recipe.image);
        img.attr("alt", recipe.label);

        //fills the text/display of the new elements
        link.html(img);
        recipeName.text(recipe.label);
        recipeDescription.text(parseArray(recipe.healthLabels));
        button.text("Add to favourites");

        //appends new elements to the page
        container.append(recipeName);
        container.append(recipeDescription);
        container.append(button);
        card.append(link);
        card.append(container);
        column.append(card);
        appendFood.append(column);
        //adding events listeners
        addFavoriteEventshandlers();
    }
};


//creates 2 random numbers between 1 and 20
function random(length) {
    var number = Math.floor(Math.random() * length);
    return number;
}


// takes an array and spearates the contents to allow proper display
function parseArray(array) {
    var parsedArray = array.join(", ");
    return parsedArray;
}

//event listener for search button
$("#searchFood").on("click", function (event) {
    event.preventDefault();

    //clears previous result cards
    $("#appendFood").empty();

    //adds ingredients to search history
    ingredients.push(foodInput.val());
    userHistory.push(foodInput.val());

    console.log("---Ingredients Array---");
    console.log(ingredients);
    console.log("--- --- ---");
    localStorage.setItem("ingredients", JSON.stringify(userHistory));

    searchHistory.val(parseArray(userHistory));

    var url = foodSearchUrl();

    //clears the input after each search
    foodInput.val("");

    $.ajax({
        url: url,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        recipeCard(response);
    })
});

// Cocktail API 

var cocktails = [];
var drinkInput = $("#drinkInput");

$("#searchDrink").on('click', function (event) {

    event.preventDefault();

    var drinkInput = $("#drinkInput").val();

    cocktails.push(drinkInput);
    userHistory.push(drinkInput);
    console.log(cocktails);
    localStorage.setItem("ingredients", JSON.stringify(userHistory));

    searchHistory.val(parseArray(userHistory));

    $("#appendDrink").empty();

    queryUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + drinkInput;

    $("#drinkInput").val("");


    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        var drinks = response.drinks.slice(0, 2);


        var results = $("#appendDrink");


        for (var i = 0; i < drinks.length; i++) {

            // Builds the card elements on the page 
            var column = $('<div class="col-sm-6">');
            var card = $('<div class="card">');
            var img = $('<img style="width:100%">');
            var link = $('<a target="_blank">');
            var container = $('<div class="container">');
            var recipeName = $('<h4 style="font-weight:bold" id="name-' + i + '"> ');
            var recipeDescription = $('<p style="font-size:15px" id="description-' + i + '">');
            var button = $('<button type="button" class="btn btn-primary favourite">');

            link.attr("href", drinks[i].strDrinkThumb);
            img.attr("src", drinks[i].strDrinkThumb);
            img.attr("alt", drinks[i].strDrink);

            link.html(img);
            button.text("Add to favourites");
            recipeName.text(drinks[i].strDrink);

            container.append(img);
            container.append(recipeName);
            container.append(recipeDescription);
            container.append(button);
            card.append(container);
            card.append(link);
            column.append(card);
            results.append(column);

            // API to get the cocktail instructions 

            var description = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + drinks[i].strDrink;

            $.ajax({
                url: description,
                method: "GET",
                context: {
                    currentIndex: i,
                }
            }).then(function (response) {
                console.log(response);
                console.log(this.currentIndex);

                $("#description-" + this.currentIndex).text(response.drinks[0].strInstructions);
            })
        }

    })
})



$(document).on({
    ajaxStart: function () {
        $("#appendFood, #appendDrink").addClass("loader");
    },
    ajaxStop: function () {
        $("#appendFood, #appendDrink").removeClass("loader");
    }
});


//add to favorite section
function addFavoriteEventshandlers() {

    $(".btn.btn-primary.favourite").off("click").on("click", function (event) {
        // debugger;
        // var cardClone = $(this).clone();
        var cardClone = $(this).parents(".card").clone();
        $("#thefavorite").append(cardClone);
        // append($(this).parents('.row').clone()).html();



    });
}

//event listener for add to favourites button

$(".favourite").on("click", function (e) {
    e.preventDefault();
    localStorage.setItem("ingredients", JSON.stringify(ingredients));
    console.log('--- Local Storage ---');
    console.log(localStorage);
    console.log('--- --- ---');


});

//event listener for clear button
$("#clear").on("click", function (event) {
    event.preventDefault();
    userHistory.length = 0;
    console.log(userHistory);
    searchHistory.val("");

})