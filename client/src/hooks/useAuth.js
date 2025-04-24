import React, { useEffect, useState } from 'react'

export default function useAuth() {

  const [authorized, setAuthorized] = useState(false);

    async function authorize() {

      try {

        const response = await fetch('/api/auth/authuser/', {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          setAuthorized(false);
        } else {
          setAuthorized(true);
        }

      } catch (error) {
        throw error;
      }

    }

    useEffect(() => {
      authorize();
    }, []);

  return { authorized }
}
