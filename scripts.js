
var ingredients = [];
var foodInput = $("#foodInput");
var searchHistory = $("#exampleFormControlTextarea1");

//builds url for ajax call
function foodSearchUrl() {

    var appKey = "65bc38bb4c3b484861c57fb9690d8edc";
    var appId = "bb8f4a04";
    var queryUrl = "https://api.edamam.com/search?q=" + ingredients + "&app_id=" + appId + "&app_key=" + appKey + "&from=0&to=2";

    return queryUrl;
}

//dynamically builds 2 card elements on the page
function recipeCard(obj) {
    for (let i = 0; i < obj.hits.length; i++) {
        var recipe = obj.hits[i].recipe;

        var appendFood = $("#appendFood");

        //jquery commands to create html elements
        var column = $('<div class="col-sm-6">');
        var card = $('<div class="card">');
        var link = $('<a target="_blank">');
        var img = $('<img style="width:100%">');
        var container = $('<div class="container">');
        var recipeName = $('<h4 style="font-weight:bold">');
        var recipeDescription = $('<p style="font-size:15px">');
        var button = $('<button type="button" class="btn btn-primary">');

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
    }
};

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
    console.log(ingredients);
    searchHistory.val(parseArray(ingredients));

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

//event listener for clear button
$("#clear").on("click", function (event) {
    event.preventDefault();
    ingredients.length = 0;
    console.log(ingredients);
    searchHistory.val("");
})