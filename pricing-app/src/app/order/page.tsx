"use client";
import OrderBreakfastItem from "@/app/order/OrderBreakfastItem";
import PlusIcon from "@/components/plusIcon";
import {
  bagelToppings,
  breakfastItems,
  drinkTypes,
  milkOptions,
  sandwichToppings,
  sizeOptions,
  sizeOptionsForHotDrink,
  toppingOptions,
} from "@/mock/data";
import { BreakFast, DrinkType } from "@/types/enum";
import { FC, useState } from "react";
import OrderCoffeeItem from "./OrderCoffeeItem";
import { Item, Order } from "@/types/type";
import OrderCoffeeItemAdded from "./OrderCoffeeItemAdded";
import { postData } from "../utils";

const Order: FC = () => {
  const [totalCost, setTotalCost] = useState<number>(0);
  const [items, setItems] = useState<Item[]>([]);

  const handleCoffeeItemAdded = (coffee: Item) => {
    setTotalCost(totalCost + coffee.cost);
    setItems([...items, coffee]);
  };

  const handleBreakfastItemAdded = (breakfast: Item) => {
    setTotalCost(totalCost + breakfast.cost);
    setItems([...items, breakfast]);
  };

  const handleRemoveItem = (id: string) => {};

  const handleOrder = () => {
    const order: Order = {
      cost: totalCost,
      status: "pending",
      items: items,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    postData("https://gemo-training-technical-assignment-p8kdqm65x-thuynguyen0807.vercel.app/makeOrder", order).then((data) => {
      console.log(data); // JSON data parsed by `data.json()` call
    });

    setItems([]);
  };

  const tax = totalCost * 0.0725;
  const finalCost = totalCost + tax;

  return (
    <div className="flex min-h-screen p-16">
      <div className="border w-full bg-white rounded-md">
        <div className="flex justify-center mt-8">
          <h1 className=" font-black text-xl">Garden Cafeteria</h1>
        </div>
        <div className="p-8">
          <div className="mb-12">
            <div className="flex">
              <PlusIcon />
              <div className="ml-2">
                <h2>Coffee</h2>
              </div>
            </div>

            {drinkTypes.map((item) => (
              <div className="pl-8 pt-4" key={item}>
                <OrderCoffeeItem
                  toppingOptions={toppingOptions}
                  sizeOptions={
                    item !== DrinkType.Hot
                      ? sizeOptions
                      : sizeOptionsForHotDrink
                  }
                  onCoffeeItemAdded={handleCoffeeItemAdded}
                  milkOptions={milkOptions}
                  type={item}
                />
              </div>
            ))}
          </div>

          {/* breakfast menu */}
          <div className="">
            <div className="flex">
              <PlusIcon />
              <div className="ml-2">
                <h2>Breakfast</h2>
              </div>
            </div>
            {breakfastItems.map((item) => (
              <div className="pl-8 pt-4" key={item}>
                <OrderBreakfastItem
                  type={item}
                  toppingOptions={
                    item === BreakFast.Sandwich
                      ? sandwichToppings
                      : bagelToppings
                  }
                  onBreakfastItemAdded={handleBreakfastItemAdded}
                />
              </div>
            ))}
          </div>
          {/* Cart */}
          <p className="font-black mt-6 ml-8 text-xl">Cart</p>
          <div className="pl-8 pt-4">
            {items.length > 0 ? (
              items.map((item, index) => (
                <OrderCoffeeItemAdded
                  type={item.type}
                  topping={item.topping}
                  size={item.size ?? "S"}
                  milk={item.milk ?? "None"}
                  chocolateSauce={item.chocolateSauce ?? 0}
                  quantity={item.quantity}
                  cost={item.cost}
                  onRemoveItem={handleRemoveItem}
                  key={index}
                />
              ))
            ) : (
              <div className="mb-4 flex justify-center">
                <p>No items has been added</p>
                <hr />
              </div>
            )}
          </div>
          {/* Cost */}

          <p className="ml-8">{`Total cost: $${totalCost}`}</p>
          <p className="ml-8">{`Tax: $${tax}`}</p>
          <p className="ml-8">{`Final cost: $${finalCost}`}</p>
          <div className=" flex justify-end">
            <button
              className="bg-gray-700 w-14 h-8 rounded text-white mr-8"
              onClick={handleOrder}
            >
              Order
            </button>
          </div>
          {/* Order */}
        </div>
      </div>
    </div>
  );
};

export default Order;
