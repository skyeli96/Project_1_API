$(document).ready(function () {
    var foodList = $("#foodList");
    var recipes = localStorage.getItem("recipe");
    var parsedRecipes = JSON.parse(recipes);
    console.log("parsedRecipes.length =" + parsedRecipes.length);
    for (let i = 0; i < parsedRecipes.length; i++) {
        var li = $("<li>");
        var a = $("<a>");

        a.attr("href", parsedRecipes[i]);
        a.text('Recipe');

        li.html(a);

        foodList.append(li);
    }
})

$("#clearAll").on("click", function (e) {
    e.preventDefault();
    localStorage.clear();
    $("#foodlist").empty();
    $("#drinkList").empty();
})