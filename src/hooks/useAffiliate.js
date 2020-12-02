import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { gql, useMutation } from '@apollo/client';

const UPDATE_USER_AFFILIATE = gql`
  mutation UpdateAffiliate(
    $id: uuid!
    $affiliate_user_id: uuid
    $affiliate_account_id: uuid!
  ) {
    update_users_by_pk(
      pk_columns: { id: $id }
      _set: {
        affiliate_user_id: $affiliate_user_id
        affiliate_account_id: $affiliate_account_id
      }
    ) {
      id
    }
  }
`;

export default function useAffiliate(props) {
  const [affiliateLoginUser, setAffiliateLoginUser] = useState({
    id: null,
    affiliate_user_id: null,
    affiliate_account_id: null
  });

  const [affiliate_user_id, setAffiliateUserId] = useState(
    Cookies.get('affiliate_user_id') ? Cookies.get('affiliate_user_id') : null
  );
  const [affiliate_account_id, setAffiliateAccountId] = useState(
    Cookies.get('affiliate_account_id')
      ? Cookies.get('affiliate_account_id')
      : null
  );
  const [updateAffiliate] = useMutation(UPDATE_USER_AFFILIATE);

  useEffect(() => {
    if (affiliate_account_id && !Cookies.get('affiliate_account_id')) {
      Cookies.set('affiliate_account_id', affiliate_account_id);
    }
  }, [affiliate_account_id, affiliate_user_id]);

  useEffect(() => {
    if (affiliate_user_id && !Cookies.get('affiliate_user_id')) {
      Cookies.set('affiliate_user_id', affiliate_user_id);
    }
  }, [affiliate_user_id]);

  useEffect(() => {
    if (
      affiliateLoginUser.id &&
      !affiliateLoginUser.affiliate_account_id &&
      affiliate_account_id
    ) {
      updateAffiliate({
        variables: {
          id: affiliateLoginUser.id,
          affiliate_account_id: Cookies.get('affiliate_account_id')
          // affiliate_user_id
        }
      });
    }
  }, [
    affiliateLoginUser,
    affiliateLoginUser.affiliate_account_id,
    affiliateLoginUser.id,
    affiliate_account_id,
    updateAffiliate
  ]);

  return { setAffiliateLoginUser, setAffiliateUserId, setAffiliateAccountId };
}
