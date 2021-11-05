import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import type { FC } from "react";
import { useCallback, useEffect } from "react";
import type { IProductListService } from "../src/client/product-list/service";
import { PRODUCT_LIST_SERVICE } from "../src/client/product-list/service";
import { observer } from "mobx-react";
import { useInjection } from "../src/client/ioc/use-injection.hook";

const Home: FC<{ service: IProductListService }> = observer(({ service }) => {
  const { user, error, isLoading } = useUser();

  const loadProductList = useCallback(() => service.load(), [service]);

  useEffect(() => {
    if (user) {
      loadProductList();
    }
  }, [loadProductList, user]);

  const listArr = service.items.map(({ id, title, lastEdited }) => {
    const date: string = lastEdited.toISOString();

    return (
      <Link key={id} href={"/product-list/" + id}>
        <li>
          {title}
          <time dateTime={date}>{date}</time>
        </li>
      </Link>
    );
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <>
        <div>
          Welcome {user.name}! <Link href="/api/auth/logout">Logout</Link>
        </div>
        <ul>{listArr}</ul>
      </>
    );
  }

  return <Link href="/api/auth/login">Login</Link>;
});

const HomeInjected: FC = (props) => (
  <Home {...props} service={useInjection(PRODUCT_LIST_SERVICE)} />
);

export default HomeInjected;
