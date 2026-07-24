FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["HealthTrack.API/HealthTrack.API.csproj", "HealthTrack.API/"]
RUN dotnet restore "HealthTrack.API/HealthTrack.API.csproj"
COPY . .
WORKDIR "/src/HealthTrack.API"
RUN dotnet build "HealthTrack.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "HealthTrack.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HealthTrack.API.dll"]