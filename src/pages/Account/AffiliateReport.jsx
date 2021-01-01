import React from 'react';
import { gql, useQuery } from '@apollo/client';
import currency from 'currency.js';

import { Centered } from 'components/styled/common';
import Spinner from 'components/ui/Spinner';
import styled from 'styled-components';
import moment from 'moment';

import {
  Typography,
} from 'antd';

const Header = styled.header`
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h1 {
      margin: 0;
    }
  }
`;

const GET_AFFILIATE_REPORT = gql`
  query watchAffiliateReport {
    affiliate_report {
      price
      event_name
      created
      affiliate_id
      account_name
    }
  }
`;

export default function AffiliateReport() {
  const { loading, error, data, refetch } = useQuery(GET_AFFILIATE_REPORT);

  if (loading) {
    return (
      <Centered padded>
        <Spinner />
      </Centered>
    );
  }

  if (error) return 'Error';

  const commissionPercent = 0.1;
  let total = 0;
  let commissionTotal = 0;
  data.affiliate_report.forEach((line) => {
    let commission = currency(line.price).multiply(commissionPercent);
    commissionTotal = currency(commissionTotal).add(commission);
    total = currency(total).add(line.price);
  });

  return (
    <article className="min-h-page">
      <Header />
      <div className="mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg sm:text-2xl lg:text-lg xl:text-2xl leading-6 font-medium text-gray-200">
            Affiliate Sales Overview
          </h2>
          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {/* Cards */}

            <div className="bg-gray-900 overflow-hidden shadow rounded-lg">
              <div className="p-6 sm:p-5 xl:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {/* Heroicon name: currency-dollar */}
                    <svg
                      className="h-8 w-8 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-6 sm:ml-5 xl:ml-6 w-0 flex-1">
                    <dl>
                      <dt className="text-base sm:text-sm xl:text-base font-medium text-gray-500 truncate">
                        Revenue
                      </dt>
                      <dd>
                        <div className="text-2xl sm:text-lg xl:text-2xl font-medium text-gray-200">
                          ${total.toString()}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-950 px-5 py-3">
                <div className="text-sm">
                  <div className="font-medium text-pink-600 hover:text-pink-800">
                    Total revenue from sales
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 overflow-hidden shadow rounded-lg">
              <div className="p-6 sm:p-5 xl:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {/* Heroicon name: chart-pie */}
                    <svg
                      className="h-8 w-8 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                      />
                    </svg>
                  </div>
                  <div className="ml-6 sm:ml-5 xl:ml-6 w-0 flex-1">
                    <dl>
                      <dt className="text-base sm:text-sm xl:text-base font-medium text-gray-500 truncate">
                        Commission
                      </dt>
                      <dd>
                        <div className="text-2xl sm:text-lg xl:text-2xl font-medium text-gray-200">
                          ${commissionTotal.toString()}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-950 px-5 py-3">
                <div className="text-sm">
                  <div className="font-medium text-pink-600 hover:text-pink-800">
                    10% commission net revenue
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="max-w-7xl mx-auto mt-12 px-4 text-lg sm:text-2xl lg:text-lg xl:text-2xl leading-6 font-medium text-gray-200 sm:px-6 lg:px-8">
          Recent Sales
        </h2>

        {/* Activity list (smallest breakpoint only) */}
        <div className="shadow sm:hidden">
          <ul className="mt-2 divide-y divide-gray-800 overflow-hidden shadow sm:hidden">
            {data.affiliate_report.map((line) => (
              <li>
                <a
                  href="#"
                  className="block px-4 py-4 bg-gray-900 hover:bg-gray-950"
                >
                  <span className="flex items-center space-x-4">
                    <span className="flex-1 flex space-x-2 truncate">
                      {/* Heroicon name: cash */}
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="flex flex-col text-gray-500 text-sm truncate">
                        <span className="truncate">
                          {line.account_name} - {line.event_name}
                        </span>
                        <span>
                          <span className="text-gray-200 font-medium">
                            ${' '}
                            {currency(line.price)
                              .multiply(commissionPercent)
                              .toString()}
                          </span>
                          &nbsp;USD
                        </span>
                        <span>{moment(line.created).fromNow()}</span>
                      </span>
                    </span>
                    {/* Heroicon name: chevron-right */}
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {/* <nav
            className="bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-800"
            aria-label="Pagination"
          >
            <div className="flex-1 flex justify-between">
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
              >
                Previous
              </a>
              <a
                href="#"
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
              >
                Next
              </a>
            </div>
          </nav> */}
        </div>

        {/* Activity table (small breakopoint and up) */}
        <div className="hidden sm:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col mt-2">
              <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-950 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event Name
                      </th>
                      <th className="px-6 py-3 bg-gray-950 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commission
                      </th>
                      <th className="hidden px-6 py-3 bg-gray-950 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:block">
                        Status
                      </th>
                      <th className="px-6 py-3 bg-gray-950 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-800">
                    {data.affiliate_report.map((line) => (
                      <tr className="bg-gray-900">
                        <td className="max-w-0 w-full px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                          <div className="flex">
                            <a
                              href="#"
                              className="group inline-flex space-x-2 truncate text-sm"
                            >
                              {/* Heroicon name: cash */}
                              <svg
                                className="flex-shrink-0 h-5 w-5 text-gray-600 group-hover:text-gray-500"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <p className="text-gray-500 truncate group-hover:text-gray-200">
                                {line.account_name} - {line.event_name}
                              </p>
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                          <span className="text-gray-200 font-medium">
                            $
                            {currency(line.price)
                              .multiply(commissionPercent)
                              .toString()}
                          </span>
                          &nbsp;USD
                        </td>
                        <td className="hidden px-6 py-4 whitespace-nowrap text-sm text-gray-500 md:block">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-600 text-green-100 capitalize">
                            complete
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                          {moment(line.created).fromNow()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                {/* <nav
                  className="bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-800 sm:px-6"
                  aria-label="Pagination"
                >
                  <div className="hidden sm:block">
                    <p className="text-sm text-gray-300">
                      Showing <span className="font-medium">1</span> to{' '}
                      <span className="font-medium">10</span> of{' '}
                      <span className="font-medium">20</span> results
                    </p>
                  </div>
                  <div className="flex-1 flex justify-between sm:justify-end">
                    <a
                      href="#"
                      className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                    >
                      Previous
                    </a>
                    <a
                      href="#"
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                    >
                      Next
                    </a>
                  </div>
                </nav> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
