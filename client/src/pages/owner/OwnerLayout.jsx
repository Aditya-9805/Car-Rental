import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppContext } from '../../context/AppContext';

const OwnerLayout = () => {

  const { user } = useAppContext();

  const navigate = useNavigate();

  const sidebarLinks = [
    {
      name: 'Dashboard',
      path: '/owner',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      end: true,
    },

    {
      name: 'Add Car',
      path: '/owner/add-car',
      icon: 'M12 4v16m8-8H4',
    },

    {
      name: 'Manage Cars',
      path: '/owner/manage-cars',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    },

    {
      name: 'Manage Bookings',
      path: '/owner/manage-bookings',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    },
  ];

  return (

    <div className="min-h-screen pt-20">

      <div className="flex">

        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex flex-col w-64 min-h-[calc(100vh-5rem)] glass-strong border-r border-slate-700/30 p-5"
        >

          {/* Owner badge */}
          <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-primary/5 border border-primary/15">

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">

              {user?.email?.charAt(0).toUpperCase()}

            </div>

            <div className="min-w-0">

              <p className="text-sm font-semibold truncate">

                {user?.email}

              </p>

              <p className="text-xs text-primary">

                Owner Account

              </p>

            </div>

          </div>

          <nav className="space-y-1 flex-1">

            {sidebarLinks.map((link) => (

              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary bg-primary/10 shadow-sm shadow-primary/5'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >

                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={link.icon}
                  />

                </svg>

                {link.name}

              </NavLink>
            ))}

          </nav>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors mt-4"
          >

            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />

            </svg>

            Back to Home

          </button>

        </motion.aside>

        {/* Mobile nav */}
        <div className="md:hidden w-full px-4 py-3 border-b border-slate-700/30 glass-strong">

          <div className="flex gap-2 overflow-x-auto pb-1">

            {sidebarLinks.map((link) => (

              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-slate-400 hover:text-white'
                  }`
                }
              >

                {link.name}

              </NavLink>
            ))}

          </div>

        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default OwnerLayout;