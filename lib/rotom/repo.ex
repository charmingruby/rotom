defmodule Rotom.Repo do
  use Ecto.Repo,
    otp_app: :rotom,
    adapter: Ecto.Adapters.Postgres

  use Paginator
end
