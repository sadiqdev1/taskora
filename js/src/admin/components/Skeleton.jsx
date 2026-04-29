import React from "react";

/* ------------------------------------------------------------------
   Base Skeleton Box
------------------------------------------------------------------ */

export const SkeletonBox = ({ className }) => (
  <div
    aria-hidden="true"
    className={`rounded animate-pulse bg-gray-100 ${className}`}
  />
);

/* ------------------------------------------------------------------
   Skeleton Wrapper (clean loading logic)
------------------------------------------------------------------ */

export const SkeletonWrapper = ({ loading, skeleton, children }) => {
  if (loading) return skeleton;
  return children;
};

/* ------------------------------------------------------------------
   Mobile Card Skeleton
------------------------------------------------------------------ */

export const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">

    <div className="flex items-start gap-4">

      <SkeletonBox className="w-16 h-16 rounded-lg" />

      <div className="flex-1 space-y-2">

        <SkeletonBox className="h-5 w-3/4" />

        <SkeletonBox className="h-4 w-1/2" />

        <div className="flex gap-2 mt-2">

          <SkeletonBox className="h-6 w-16 rounded-full" />
          <SkeletonBox className="h-6 w-16 rounded-full" />

        </div>

      </div>

    </div>

    <div className="flex justify-end gap-4 pt-3 border-t border-gray-100">

      <SkeletonBox className="w-8 h-8 rounded-full" />
      <SkeletonBox className="w-8 h-8 rounded-full" />
      <SkeletonBox className="w-8 h-8 rounded-full" />
      <SkeletonBox className="w-8 h-8 rounded-full" />

    </div>

  </div>
);

/* ------------------------------------------------------------------
   Desktop Table Skeleton
------------------------------------------------------------------ */

export const SkeletonTable = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">

    <div className="overflow-x-auto">

      <table className="w-full text-sm">

        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-4 py-3"><SkeletonBox className="h-4 w-16" /></th>
            <th className="px-4 py-3"><SkeletonBox className="h-4 w-16" /></th>
            <th className="px-4 py-3"><SkeletonBox className="h-4 w-16" /></th>
            <th className="px-4 py-3"><SkeletonBox className="h-4 w-16" /></th>
            <th className="px-4 py-3"><SkeletonBox className="h-4 w-16" /></th>
            <th className="px-4 py-3"><SkeletonBox className="h-4 w-16" /></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">

          {Array.from({ length: 4 }).map((_, i) => (

            <tr key={i}>

              <td className="px-4 py-3">
                <SkeletonBox className="w-12 h-12 rounded-lg" />
              </td>

              <td className="px-4 py-3">
                <SkeletonBox className="h-4 w-32" />
              </td>

              <td className="px-4 py-3">
                <SkeletonBox className="h-4 w-20" />
              </td>

              <td className="px-4 py-3">
                <SkeletonBox className="h-4 w-20" />
              </td>

              <td className="px-4 py-3">
                <SkeletonBox className="h-6 w-16 rounded-full" />
              </td>

              <td className="px-4 py-3">

                <div className="flex gap-2">

                  <SkeletonBox className="w-8 h-8 rounded" />
                  <SkeletonBox className="w-8 h-8 rounded" />
                  <SkeletonBox className="w-8 h-8 rounded" />
                  <SkeletonBox className="w-8 h-8 rounded" />

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </div>
);

/* ------------------------------------------------------------------
   Pagination Skeleton
------------------------------------------------------------------ */

export const SkeletonPagination = () => (

  <div className="flex justify-end mt-4 gap-2">

    {Array.from({ length: 6 }).map((_, i) => (
      <SkeletonBox key={i} className="w-10 h-8 rounded" />
    ))}

  </div>

);

/* ------------------------------------------------------------------
   Combined Responsive Skeleton (Memes Manager)
------------------------------------------------------------------ */

export const MemesManagerSkeleton = () => (

  <>

    {/* Mobile Cards */}

    <div className="block md:hidden space-y-4">

      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}

    </div>

    {/* Desktop Table */}

    <div className="hidden md:block">

      <SkeletonTable />

    </div>

    {/* Pagination */}

    <SkeletonPagination />

  </>

);

/* ------------------------------------------------------------------
   Other Tab Skeletons
------------------------------------------------------------------ */

export const UsersManagerSkeleton = MemesManagerSkeleton;

export const ReportsManagerSkeleton = MemesManagerSkeleton;

export const SettingsViewSkeleton = () => (

  <div className="space-y-6">

    <SkeletonBox className="h-8 w-48" />

    <SkeletonBox className="h-96 w-full" />

  </div>

);