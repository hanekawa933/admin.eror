import React from "react";
import cookies from "next-cookies";

export const ProtectedRoute = (WrapperComponent) => {
  // eslint-disable-next-line react/display-name
  return class extends React.Component {
    static async getInitialProps(ctx) {
      const token = cookies(ctx)["token"];
      if (!token) {
        const route = "/";

        if (ctx.res) {
          ctx.res.writeHead(302, { location: route });
          ctx.res.end();
        }
      }

      const initialProps = {
        token,
        query: ctx.query,
        asPath: ctx.asPath,
      };

      if (WrapperComponent.getInitialProps) {
        return WrapperComponent.getInitialProps(initialProps);
      }

      return initialProps;
    }

    render() {
      const { ...propsWithoutAuth } = this.props;
      return <WrapperComponent {...propsWithoutAuth} />;
    }
  };
};
