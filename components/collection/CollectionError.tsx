import { ExclamationTriangle } from "../icons/exclamation-triangle";
type CollectionErrorProps = {
  message: string;
};
export const CollectionError = (props: CollectionErrorProps) => {
  const { message } = props;
  return (
    <section className="text-gray-600 body-font py-24">
      <div className="container px-5 py-24 mx-auto">
        <div className="xl:w-1/2 lg:w-3/4 w-full mx-auto text-center">
          <ExclamationTriangle />

          <p className="leading-relaxed text-lg">
            Oops an error occurred: {message}
          </p>
          <span className="inline-block h-1 w-10 rounded bg-indigo-500 mt-8 mb-6"></span>
        </div>
      </div>
    </section>
  );
};
