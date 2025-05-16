# Class Unity School Management System 

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Our Github Repository](https://github.com/FilippoDeSilva/class-unity-nextjs-school-management-system) 
- [Next.js](https://nextjs.org/learn)


## To fully run the project 

-To run the project fully:

- npm run dev
<!-- - npx convex dev -->
- npx prisma studio
- run a docker postgres container for the database with POSTGRES_USER=<your-user> and POSTGRES_PASSWORD=<your-password> and POSTGRES_DB=<your-db> and use the default port

<h5>

- create a .env file at the directory of the project and put something like this:  </br>
   
    NEXT_PUBLIC_STREAM_API=<your-next-stream-public-api>    </br>
    STREAM_API_SECRET=<your-stream-api-secret>               </br>
    STREAM_APP_ID=<your-app-id>                              </br>
    #JWT STRING                                               </br>
    JWT_SECRET=<your-jwt-secret>                              </br>
    NEXTAUTH_SECRET=<your-next-auth-secret> It'll be added by `npx auth`. Read more: https://cli.authjs.dev       </br>
    DATABASE_URL='postgresql://<databaseuser>:<databasepassword>@localhost:5432/<databasename>'                   </br>
    
- create a .env.local file at the directory of the project and put something like this:                           </br>
  
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-next-public-clerk-publishable-key>                                    </br>
    CLERK_SECRET_KEY=<your-clerk-secret-key>                                                                     </br>
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/                                                                              </br>
    CLERK_WEBHOOK_SECRET=<your-clerk-webhook-secret>                                                             </br>
  </h5>
```bash
      A AUTOMATICALLY GENERATED ENCRYPTION KEY FOR CLERK

      YOU CAN GENERATE ONE FOLLOWING THE STEPS:
  
      For Linux:
  
      openssl rand -base64 32
  
      OR WITH A POWERSHELL COMMAND for Windows:
  
      $rng = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
      $bytes = New-Object byte[](32)
      $rng.GetBytes($bytes)
      $key = [Convert]::ToBase64String($bytes)
      Write-Output $key

    CLERK_ENCRYPTION_KEY=<your-clerk-encryption-key>
```
<h5>   
    #STREAM API                                                                                                 </br>
    NEXT_PUBLIC_STREAM_API=<your-next-public-stream-api>                                                       </br>
    STREAM_API_SECRET=<your-stream-api-secret>                                                                </br>
    #Claudinary Secrets                                                                                       </br>
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-public-cloudinary-cloud-name>                                     </br>
    NEXT_PUBLIC_CLOUDINARY_API_KEY=<your-next-public-cloudinary-api-key>                                      </br>
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<your-next-public-cloudinary-upload-presets>                         </br>
    CLOUDINARY_URL=<your-cloudinary-url>                                                                      </br>
</h5>

## Maintenance commands

- npx prisma db seed
- npm i -d ts-node    
- npx prisma migrate dev --name migrations
- npx prisma generate
- npx prisma studio    
- npx prisma migrate reset
