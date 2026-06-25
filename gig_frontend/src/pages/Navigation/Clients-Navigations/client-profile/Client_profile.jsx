import React from 'react'
import { useGetClientInfo } from '../../../../hooks/Client_releted/useGetClientInfo';

const Client_profile = () => {

    const {
        data: clientData,
        isLoading,
        error,
        isError,
        refetch,
    
      } = useGetClientInfo();

      console.log("clientData in client profile ", clientData);

  return (
    <div>Client_profile</div>
  )
}

export default Client_profile
