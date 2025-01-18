export default function MenuItem() {
  return (
    <div className="bg-gray-200 p-4 rounded-lg text-center hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all">
      <div className="text-center ">
        <img
          src="/pizza.png"
          alt="pizza"
          className="max-h-auto max-h-24 block mx-auto"
        />
      </div>
      <h4 className="font-semibold my-2 text-xl my-3">Peporini pizza</h4>
      <p className="text-gray-500 text-sm">
        This pepperoni pizza recipe produces a quick and
      </p>
      <button className="mt-4 bg-primary rounded-full text-white px-8 py-2 ">
        Add to Cart $12
      </button>
    </div>
  );
}
