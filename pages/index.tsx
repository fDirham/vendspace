import useAuthGate from 'hooks/useAuthGate';
import useUserAuth from 'hooks/useUserAuth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { DEFAULT_PREVIEW_IMG, SHARE_SITE_URL } from 'utilities/constants';

export default function Home() {
  const router = useRouter();
  const currentUser = useUserAuth();
  useAuthGate(currentUser, router);
  useEffect(() => {
    if (!!currentUser && currentUser.handle) {
      router.replace(`/s/${currentUser.handle}`);
    }
  }, [currentUser]);

  const metaTitle = 'VendSpace';
  const metaDescription = 'A simple way to sell items to the people you trust.';
  const metaImg = DEFAULT_PREVIEW_IMG;
  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name='title' content={metaTitle} />
      <meta name='twitter:title' content={metaTitle} />
      <meta itemProp='name' content={metaTitle} />
      <meta name='og:title' content={metaTitle} />
      <meta name='description' content={metaDescription} />
      <meta name='og:description' content={metaDescription} />
      <meta itemProp='description' content={metaDescription} />
      <meta name='twitter:description' content={metaDescription} />
      <meta name='og:url' content={SHARE_SITE_URL} />
      <meta name='robots' content='index, follow' />
      <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
      <meta name='author' content={'Fontaine Dynamo'} />
      <meta name='og:site_name' content='VendSpace' />
      <meta name='language' content='English' />
      <meta name='og:type' content='website' />
      <meta charSet='utf-8' />
      <meta name='image' content={metaImg} />
      <meta itemProp='image' content={metaImg} />
      <meta name='og:image' content={metaImg} />
      <meta name='twitter:image:src' content='image' />
      <meta name='twitter:card' content='summary' />
    </Head>
  );
}
