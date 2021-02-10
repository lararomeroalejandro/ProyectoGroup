/*
En esta consulta se obtendrá el mes, nombre, precio de compra al proveedor (tanto con IVA, como sin él), precio de venta
al público (también con y sin IVA) y el IVA de la compra y de la venta de los artículos vendidos durante la segunda mitad
del año. En esta consulta se agrupan los artículos con dos campos: nombre del artículo y mes de su venta. Además, solo
se muestran los 5 artículos con más facturación gracias a una ordenación descendente.
*/

db.ventas.aggregate(
    [
        {
            $match: {$expr: {$gte: [{$month: "$fechaventa"},06]}}
        },{
            $group: {
                _id: {
                    articulo: "$articulo",
                    mes: {$month: "$fechaventa"}
                },
                ventaPublico: {$sum: {$multiply: ["$preciounidad", "$unidades"]}},
                compraProv: {$sum: {$multiply: ["$precioproveedor", "$unidades"]}}
            }
        },{
            $project: {
                mes: "$_id.mes",
                articulo: "$_id.articulo",
                _id: 0,
                ventaAlPublico: "$ventaPublico",
                compraBienes: "$compraProv",
                IVAventa: { $multiply: ["$ventaPublico", 0.21] },
                IVAcompra: {$multiply: ["$compraProv", 0.21]},
                
            }
        },{
            $set: {
                totalVentaConIVA: {$add: ["$ventaAlPublico", "$IVAventa"]},
                totalCompraConIVA: {$add: ["$compraBienes", "$IVAcompra"]}
            }           
        },{
            $sort: {
                totalVentaConIVA: -1
            }
        },{
            $limit: 5
        }
    ]
).pretty()


