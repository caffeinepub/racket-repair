export function Products() {
  const products = [
    {
      id: 1,
      name: "Badminton Grip Stick",
      description:
        "Wooden grip sticks for shaping and replacing racket handles.",
      image: "/assets/uploads/41NFSXtiUSL._AC_UF350-350_QL80_-1.jpg",
    },
    {
      id: 2,
      name: "Stringing Awl Tool",
      description:
        "Professional awl tool for stringing and repairing badminton rackets.",
      image: "/assets/uploads/300016219-2.jpg",
    },
    {
      id: 3,
      name: "Yonex Grommet Strips",
      description:
        "Genuine Yonex badminton grommet strips for racket frame protection.",
      image:
        "/assets/uploads/yonex-badminton-grommet-strips__69743__77706.1698770344-3.jpg",
    },
  ];

  return (
    <section
      id="products"
      style={{ backgroundColor: "#ffffff" }}
      className="py-16 px-4"
      data-ocid="products.section"
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl font-bold text-center mb-2"
          style={{ color: "#1a3a6b" }}
        >
          Our Products
        </h2>
        <p className="text-center text-gray-500 mb-10">
          Quality repair accessories available at our shop
        </p>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          data-ocid="products.list"
        >
          {products.map((product, idx) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden flex flex-col"
              data-ocid={`products.item.${idx + 1}`}
            >
              <div className="bg-gray-50 flex items-center justify-center h-52">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-contain h-44 w-full p-4"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3
                  className="font-semibold text-lg mb-1"
                  style={{ color: "#1a3a6b" }}
                >
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
