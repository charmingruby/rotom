defmodule Rotom.Repo.Migrations.CreateUindexOnRoomName do
  use Ecto.Migration

  def change do
    create unique_index(:rooms, :name)
  end
end
