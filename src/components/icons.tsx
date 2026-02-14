import * as React from "react";

import { IconSvgProps } from "@/types";

export const GithubIcon: React.FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const ClockIcon: React.FC<IconSvgProps> = ({
  size = 16,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height}
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SkullIcon: React.FC<IconSvgProps> = ({
  size = 16,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      height={size || height}
      viewBox="0 0 14 14"
      width={size || width}
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M1.875 6.375a5.125 5.125 0 1 1 8.244 4.067a.63.63 0 0 0-.244.495v1.438a.375.375 0 0 1-.375.375h-.625V11.5a.625.625 0 1 0-1.25 0v1.25h-1.25V11.5a.625.625 0 1 0-1.25 0v1.25H4.5a.375.375 0 0 1-.375-.375v-1.438a.63.63 0 0 0-.244-.495a5.12 5.12 0 0 1-2.006-4.067M7 0a6.375 6.375 0 0 0-4.125 11.236v1.139c0 .898.728 1.625 1.625 1.625h5c.898 0 1.625-.727 1.625-1.625v-1.14A6.375 6.375 0 0 0 7 0M6 7a1.25 1.25 0 1 1-2.5 0A1.25 1.25 0 0 1 6 7m4.5 0A1.25 1.25 0 1 1 8 7a1.25 1.25 0 0 1 2.5 0"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const LocationPinIcon: React.FC<IconSvgProps> = ({
  size = 16,
  width,
  height,
  ...props
}) => (
  <svg
    fill="none"
    height={size || height}
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SearchIcon = (props: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

export const TrashIcon: React.FC<IconSvgProps> = ({
  size = 20,
  width,
  height,
  ...props
}) => (
  <svg
    fill="none"
    height={size || height}
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
