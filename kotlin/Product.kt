// Ejercicio Kotlin · Parte 4 del parcial.
//
// Alcance: val/var, funciones, clases, tipos nullable, if/when
// y plantillas de cadena.
//
// Este archivo puede ejecutarse en:
// https://play.kotlinlang.org

class Product(
    val id: Int,
    val name: String,
    var price: Double,
    val category: String,
    var stock: Int?
)

fun stockLabel(stock: Int?): String {
    return when {
        stock == null -> "Sin dato"
        stock == 0 -> "Agotado"
        stock < 5 -> "Pocas unidades"
        else -> "Disponible"
    }
}

fun applyDiscount(price: Double, percent: Int): Double {
    val discount = price * percent / 100.0
    return price - discount
}

fun main() {
    val products = listOf(
        Product(
            id = 1,
            name = "Agua mineral",
            price = 1800.0,
            category = "Bebidas",
            stock = 10
        ),
        Product(
            id = 2,
            name = "Galletas de avena",
            price = 2700.0,
            category = "Snacks",
            stock = 0
        ),
        Product(
            id = 3,
            name = "Producto sin inventario",
            price = 5000.0,
            category = "Hogar",
            stock = null
        )
    )

    for (product in products) {
        val discountedPrice = applyDiscount(
            product.price,
            10
        )

        println(
            "Producto: ${product.name} | " +
                "Stock: ${stockLabel(product.stock)} | " +
                "Precio con 10% de descuento: $discountedPrice"
        )
    }
}