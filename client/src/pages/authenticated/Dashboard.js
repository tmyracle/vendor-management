import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { withToken } from '../../lib/authHandler'
import FillBar from '../../components/ui/FillBar'
import toast from 'react-hot-toast'
import { OfficeBuildingIcon, CheckCircleIcon } from '@heroicons/react/solid'
import StripedTable from '../../components/StripedTable'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [documents, setDocuments] = useState(null)
  const [userName, setUserName] = useState(null)
  const [companyName, setCompanyName] = useState(null)
  const [companyLogo, setCompanyLogo] = useState(null)

  const columnNames = [
    { displayName: 'Vendor', field: 'vendor_name', dataType: 'text' },
    { displayName: 'Type', field: 'type', dataType: 'uppercaseText' },
    { displayName: 'Uploaded by', field: 'uploader', dataType: 'text' },
    { displayName: 'Last updated', field: 'updated_at', dataType: 'date' },
  ]

  const fetchDashboardData = useCallback(async (isMounted) => {
    try {
      const res = await axios.get(`/api/v1/dashboard`, withToken())
      if (res.status === 200 && isMounted) {
        buildStats(res.data)
      }
    } catch (error) {
      toast.error('Error fetching dashboard data')
    }
  }, [])

  const buildStats = (data) => {
    setUserName(data.user_name)
    setCompanyName(data.company_name)
    setCompanyLogo(data.company_logo)

    let sortedDocs = data.documents.sort((a, b) => {
      return new Date(b.updated_at) - new Date(a.updated_at)
    })
    setDocuments(sortedDocs.slice(0, 10))

    let stats = [
      {
        name: 'MSA',
        required: data.msa_required,
        compliant: data.msa_compliant,
        percent: Number((data.msa_compliant / data.msa_required) * 100),
      },
      {
        name: 'COI',
        required: data.coi_required,
        compliant: data.coi_compliant,
        percent: Number((data.coi_compliant / data.coi_required) * 100),
      },
      {
        name: 'W9',
        required: data.w9_required,
        compliant: data.w9_compliant,
        percent: Number((data.w9_compliant / data.w9_required) * 100),
      },
    ]
    setStats(stats)
  }

  useEffect(() => {
    let isMounted = true
    fetchDashboardData(isMounted)
    return () => {
      isMounted = false
    }
  }, [fetchDashboardData])

  return (
    <div className="mt-8 p-8">
      {userName ? (
        <>
          <div className="bg-white shadow mb-6 lg:border-t lg:border-gray-200 rounded-md">
            <div className="px-4 sm:px-6 lg:mx-auto lg:px-8">
              <div className="py-6 md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  {/* Profile */}
                  <div className="flex items-center">
                    <img
                      className="hidden h-16 border border-gray-200 w-16 rounded-full sm:block"
                      src={companyLogo}
                      alt=""
                    />
                    <div>
                      <div className="flex items-center">
                        <img
                          className="h-16 w-16 rounded-full sm:hidden"
                          src={companyLogo}
                          alt=""
                        />
                        <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                          Welcome back, {userName}
                        </h1>
                      </div>
                      <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                        <dt className="sr-only">Company</dt>
                        <dd className="flex items-center text-sm text-gray-500 font-medium capitalize sm:mr-6">
                          <OfficeBuildingIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          {companyName}
                        </dd>
                        <dt className="sr-only">Account status</dt>
                        <dd className="mt-3 flex items-center text-sm text-gray-500 font-medium sm:mr-6 sm:mt-0 capitalize">
                          <CheckCircleIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                            aria-hidden="true"
                          />
                          Verified account
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                  {/*
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Add money
                  </button>
                  */}
                </div>
              </div>
            </div>
          </div>
          {stats ? (
            <div className="mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Compliance
              </h3>
              <dl className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {stats.map((item) => (
                  <div
                    key={item.name}
                    className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
                  >
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900 mb-2">
                      {item.compliant} / {item.required}{' '}
                      <span className="text-lg font-medium text-gray-400">
                        vendors
                      </span>
                    </dd>
                    <FillBar
                      percentNumber={item.percent}
                      lowThreshold={35}
                      midThreshold={70}
                    />
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
          {documents ? (
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent documents
              </h3>
              <StripedTable
                columnNames={columnNames}
                tableData={documents}
                dataEditable={false}
              />
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}

export default Dashboard
