import React from 'react';
import BuyButton from 'components/Event/BuyButton';
import sortProducts from 'lib/sortProducts';

export default function Supporters({ account, user }) {
  return (
    <div
      className="md:mt-11 rounded-lg md:mr-5 md:w-80 p-1 border-pink-800"
      data-test-id="account-pricing"
    >
      {sortProducts(account.products).map((product, index) => (
        <div
          key={index}
          className="flex flex-col rounded-lg shadow-lg overflow-hidden mb-2 border-2 border-gray-900"
        >
          <div className="px-6 py-8 bg-black sm:p-10 sm:pb-6">
            <div>
              <h3
                className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-gray-900 text-pink-600"
                id="tier-standard"
              >
                {product.name}
              </h3>
            </div>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-pink-500">
              {product.price}
              <span className="text-base font-medium text-gray-500">
                /
                {product.access_length >= 28 && product.access_length <= 31
                  ? 'm'
                  : ` ${product.access_length} days`}
              </span>
            </div>
            <p className="text-lg text-gray-500">{product.description}</p>
          </div>
          <div className="flex-1 flex flex-col justify-between px-6 pt-1 bg-black sm:p-10 sm:pt-6 xs:pb-5">
            <ul role="list" className="">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-base text-gray-700">Fan Chat</p>
              </li>

              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-base text-gray-700">Community Video</p>
              </li>

              {product.account_access && (
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">
                    Full Channel Access
                  </p>
                </li>
              )}

              {product.download_access && (
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">
                    Download Access
                  </p>
                </li>
              )}
            </ul>
            <BuyButton
              className="block w-full"
              disabled={!account.stripe_data ? true : false}
              product={product}
              user={user}
              account={account}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
