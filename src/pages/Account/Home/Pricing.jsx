import React from 'react';
import BuyButton from 'components/Event/BuyButton';

function Pricing({ hasAccess, user, account }) {
  return (
    <div className="bg-black">
      <div className="pb-5 px-6">
        <div className="md:grid-cols-2 lg:grid-cols-4 space-y-4 sm:space-y-0 sm:grid sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {account.products.map((product, index) => (
            <div
              key={index}
              className="max-w-md border border-gray-800 rounded-lg shadow-sm divide-y divide-gray-800"
            >
              <div className="p-6">
                <h2 className="text-lg leading-6 font-medium text-pink-900">
                  {product.name}
                </h2>
                <p className="h-20 mt-4 text-sm text-gray-500">
                  {product.description}
                </p>
                <p className="mt-8">
                  <span className="text-3xl font-extrabold text-pink-900">
                    {product.price}
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /
                    {product.access_length >= 28 && product.access_length <= 31
                      ? 'm'
                      : ` ${length} days`}
                  </span>
                </p>
                {account.stripe_data ? (
                  <BuyButton
                    className="block w-full"
                    disabled={true}
                    product={product}
                    user={user}
                    account={account}
                  />
                ) : null}
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-pink-900 tracking-wide uppercase">
                  What's included
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">Fan Chat</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Community Video
                    </span>
                  </li>
                  {product.account_access && (
                    <li className="flex space-x-3">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-500">
                        Full Channel Access
                      </span>
                    </li>
                  )}
                  {product.download_access && (
                    <li className="flex space-x-3">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-500">
                        Download Access
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pricing;
