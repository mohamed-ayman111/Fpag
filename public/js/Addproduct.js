const form = document.forms["Addproduct"];
form.addEventListener("submit", function (e){
    const name = form.name.value.trim();
    const category = form.category.value;
    const description = form.description.value.trim();
    const price = form.price.value.trim();
    const image = form.image.value.trim();
    const stock = form.stock.value.trim();

    if(!name ||!category||!description||!price||!image||!stock){
        e.preventDefault();
        alert("All field require.");
        return ;
    }
});