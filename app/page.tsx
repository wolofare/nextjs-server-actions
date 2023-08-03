import { revalidateTag } from "next/cache";

interface Product {
  id?: number;
  name: string;
  price: string;
}

// Server Actions
const addProduct = async (formData: FormData) => {
  "use server";
  const name = formData.get("name")?.toString();
  const price = formData.get("price")?.toString();

  if (!name || !price) {
    throw Error("Please fill all fields");
  }

  const newProduct: Product = {
    name: name,
    price: price,
  };

  await fetch("https://64cb80a3700d50e3c706012a.mockapi.io/products", {
    method: "POST",
    body: JSON.stringify(newProduct),
    headers: {
      "Content-Type": "application/json",
    },
  });

  //   Server-mutations revalidate to update UI
  revalidateTag("products");
};

export default async function Product() {
  // fetch created data
  const res = await fetch(
    "https://64cb80a3700d50e3c706012a.mockapi.io/products",
    {
      cache: "no-cache",
      next: {
        tags: ["products"],
      },
    }
  );

  const products: Product[] = await res.json();

  return (
    <div className="max-w-lg mx-auto mt-12">
      <h1 className="text-xl text-center font-bold">Add Product</h1>
      <form action={addProduct} className="flex flex-col gap-3 my-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          className="border-gray-500 border-[1px] p-2"
        />
        <input
          type="text"
          name="price"
          placeholder="Product price"
          className="border-gray-500 border-[1px] p-2"
        />
        <button type="submit" className="bg-gray-700 text-white p-2">
          Add Product
        </button>
      </form>

      {/* Accessing all created products */}
      <section className="flex flex-wrap gap-5">
        {products.map((product) => {
          const { id, name, price } = product;
          return (
            <div key={id}>
              <h3>{name}</h3>
              <p>{price}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
