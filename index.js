const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://lead_Collector:lead_Collector@lead-collector.ya2fsz3.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// Middleware function to verify JWT
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: 'Invalid token.' });
    }

    // If the token is valid, store decoded information for later use
    req.user = decoded;
    next();
  });
}

async function run() {
  try {
    await client.connect();
    /* collection */
    const usersCollection = client.db("lead-Collector").collection("userList");
    const adminsCollection = client.db("lead-Collector").collection("adminList");
    const buyersCollection = client.db("lead-Collector").collection("buyerList");
    const leadsCollection = client.db("lead-Collector").collection("leads");
    const takeleadsCollection = client.db("lead-Collector").collection("leadsCollection");
    const listCollection = client.db("lead-Collector").collection("listCollection");
    const depositCollection = client.db("lead-Collector").collection("depositList");
    const newWithdrawCollection = client.db("lead-Collector").collection("withdrawCollection");
    const bannersCollection = client.db("lead-Collector").collection("bannerCollection");


app.post("/login", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1d' }); 
  res.json({ token });
});




    /*  post */
    app.post("/create-user", async (req, res) => {
      const createUser = req.body;
      const result = await usersCollection.insertOne(createUser);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = usersCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get("/user", async (req, res) => {
      const email = req.query.userEmail;
      const query = { userEmail: email };
      const cursor = usersCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });

    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    app.put("/update-balance/:id", async (req, res) => {
      const id = req.params.id;
      const updateBalance = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          currentBalance: updateBalance.currentBalance,
        },
      };

      const result = await usersCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.put("/update-user/:id", async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          userFullName: updateUser.userFullName,
          profileImage: updateUser.profileImage,
          userEmail: updateUser.userEmail,
          currentBalance: updateUser.currentBalance,
          address: updateUser.address,
          city: updateUser.city,
          country: updateUser.country,
      
        },
      };

      const result = await usersCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });



    /*Withdraw option  */

    app.post("/new-withdraw", async (req, res) => {
      const withdraw = req.body;
      const result = await newWithdrawCollection.insertOne(withdraw);
      res.send(result);
    });

    app.get("/all-withdraws", async (req, res) => {
      const query = {};
      const cursor = newWithdrawCollection.find(query);
      const withdraws = await cursor.toArray();
      res.send(withdraws);
    });

    app.get("/withdraw/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const withdraw = await newWithdrawCollection.findOne(query);
      res.send(withdraw);
    });



    app.put("/update-withdrawal/:id", async (req, res) => {
      const id = req.params.id;
      const updateWithdrawalStatus = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          withdrawalStatus: updateWithdrawalStatus.withdrawalStatus,
        },
      };

      const result = await newWithdrawCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });


    /*  Admin */
    app.post("/create-admin", async (req, res) => {
      const createAdmin = req.body;
      const result = await adminsCollection.insertOne(createAdmin);
      res.send(result);
    });

    app.get("/admins", async (req, res) => {
      const query = {};
      const cursor = adminsCollection.find(query);
      const admins = await cursor.toArray();
      res.send(admins);
    });

    app.get("/admin", async (req, res) => {
      const email = req.query.adminEmail;
      const query = { adminEmail: email };
      const cursor = adminsCollection.find(query);
      const admin = await cursor.toArray();
      res.send(admin);
    });

    app.get("/admin/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const admin = await adminsCollection.findOne(query);
      res.send(admin);
    });

    app.put("/admin-update/:id", async (req, res) => {
      const id = req.params.id;
      const updateAdmin = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          adminProfileImage: updateAdmin.adminProfileImage,
          adminName: updateAdmin.adminName,
          adminEmail: updateAdmin.adminEmail,
          
        },
      };

      const result = await adminsCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });




    /*  Take Lead Collection */
    app.post("/new-lead-collection", async (req, res) => {
      const collect = req.body;
      const result = await takeleadsCollection.insertOne(collect);
      res.send(result);
    });

    app.get("/all-collected-leads", async (req, res) => {
      const query = {};
      const cursor = takeleadsCollection.find(query);
      const allLeads = await cursor.toArray();
      res.send(allLeads);
    });

      app.get("/collected-lead/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const collected = await takeleadsCollection.findOne(query);
      res.send(collected);
    });

      app.put("/collected-lead-update/:id", async (req, res) => {
      const id = req.params.id;
      const updateStatus = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          amountCredited: updateStatus.amountCredited,
        },
      };

      const result = await takeleadsCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });


    app.get("/user", async (req, res) => {
      const email = req.query.userEmail;
      const query = { userEmail: email };
      const cursor = usersCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });

    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    app.put("/update-balance/:id", async (req, res) => {
      const id = req.params.id;
      const updateBalance = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          currentBalance: updateBalance.currentBalance,
        },
      };

      const result = await usersCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

       /*  post */

       app.post("/create-buyer", async (req, res) => {
        const createBuyer = req.body;
        const result = await buyersCollection.insertOne(createBuyer);
        res.send(result);
      });
  
      app.get("/buyers", async (req, res) => {
        const query = {};
        const cursor = buyersCollection.find(query);
        const buyers = await cursor.toArray();
        res.send(buyers);
      });
  
      app.get("/buyer", async (req, res) => {
        const email = req.query.buyerEmail;
        const query = { buyerEmail: email };
        const cursor = buyersCollection.find(query);
        const user = await cursor.toArray();
        res.send(user);
      });
  
      app.get("/buyer/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const buyer = await buyersCollection.findOne(query);
        res.send(buyer);
      });
  
      app.put("/buyer-update-balance/:id", async (req, res) => {
        const id = req.params.id;
        const updateBalance = req.body;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = {
          $set: {
            currentBalance: updateBalance.currentBalance,
          },
        };
  
        const result = await buyersCollection.updateOne(
          filter,
          updatedDoc,
          options
        );
        res.send(result);
      });


      app.put("/buyer-update-profile-admin/:id", async (req, res) => {
        const id = req.params.id;
        const updatebuyer = req.body;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = {
          $set: {
            buyerFullName: updatebuyer.buyerFullName,
            currentBalance: updatebuyer.currentBalance,
            buyerProfileImage: updatebuyer.buyerProfileImage,
            address: updatebuyer.address,
            city: updatebuyer.city,
            country: updatebuyer.country,
          
          },
        };
  
        const result = await buyersCollection.updateOne(
          filter,
          updatedDoc,
          options
        );
        res.send(result);
      });

      app.put("/buyer-update-profile/:id", async (req, res) => {
        const id = req.params.id;
        const updatebuyer = req.body;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = {
          $set: {
            buyerFullName: updatebuyer.buyerFullName,
            buyerProfileImage: updatebuyer.buyerProfileImage,
            address: updatebuyer.address,
            city: updatebuyer.city,
            country: updatebuyer.country,
          
          },
        };
  
        const result = await buyersCollection.updateOne(
          filter,
          updatedDoc,
          options
        );
        res.send(result);
      });

    

       /* create post */

       app.post("/create-list", async (req, res) => {
        const list = req.body;
        const result = await listCollection.insertOne(list);
        res.send(result);
      });
  
      app.get("/lists", async (req, res) => {
        const query = {};
        const cursor = listCollection.find(query);
        const lists = await cursor.toArray();
        res.send(lists);
      });

      app.get("/list/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const list = await listCollection.findOne(query);
        res.send(list);
      });

      app.delete("/list/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };

  try {
    const result = await listCollection.deleteOne(query);
    if (result.deletedCount === 1) {
      res.send({ message: "List deleted successfully" });
    } else {
      res.status(404).send({ message: "List not found" });
    }
  } catch (err) {
    res.status(500).send({ message: "Error deleting the list", error: err });
  }
});

       /* Deposit */

       app.post("/new-deposit", async (req, res) => {
        const deposit = req.body;
        const result = await depositCollection.insertOne(deposit);
        res.send(result);
      });
  
      app.get("/deposits", async (req, res) => {
        const query = {};
        const cursor = depositCollection.find(query);
        const deposits = await cursor.toArray();
        res.send(deposits);
      });

      app.get("/deposit/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const deposit = await depositCollection.findOne(query);
        res.send(deposit);
      });

      app.put("/deposit-status/:id", async (req, res) => {
        const id = req.params.id;
        const depositStatus = req.body;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = {
          $set: {
            depositStatus: depositStatus.depositStatus,       
          },
        };
        const result = await depositCollection.updateOne(
          filter,
          updatedDoc,
          options
        );
        res.send(result);
      });





    /***
     * Lead
     * **/
    app.post("/add-lead", async (req, res) => {
      const addLead = req.body;
      const result = await leadsCollection.insertOne(addLead);
      res.send(result);
    });

    app.get("/leads", async (req, res) => {
      const query = {};
      const cursor = leadsCollection.find(query);
      const leads = await cursor.toArray();
      res.send(leads);
    });

    app.get("/lead/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const lead = await leadsCollection.findOne(query);
      res.send(lead);
    });

    app.put("/lead-update/:id", async (req, res) => {
      const id = req.params.id;
      const leadUpdate = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          leadSubmitStatus: leadUpdate.leadSubmitStatus,
        },
      };

      const result = await leadsCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

   /* Banner Option */
   app.post("/add-banner", async (req, res) => {
    const addBanner = req.body;
    const result = await bannersCollection.insertOne(addBanner);
    res.send(result);
  });

  app.get("/banners", async (req, res) => {
    const query = {};
    const cursor = bannersCollection.find(query);
    const banners = await cursor.toArray();
    res.send(banners);
  });

  app.get("/banner/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const banner = await bannersCollection.findOne(query);
    res.send(banner);
  });

  app.put("/banner-update/:id", async (req, res) => {
    const id = req.params.id;
    const bannerUpdate = req.body;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updatedDoc = {
      $set: {
        img: bannerUpdate.img,
        title: bannerUpdate.title,
        bannerDescription: bannerUpdate.bannerDescription,
        buttonText: bannerUpdate.buttonText,
        buttonLink: bannerUpdate.buttonLink,
        videoTitle: bannerUpdate.videoTitle,
        youtubeLink: bannerUpdate.youtubeLink,

      },
    };

    const result = await bannersCollection.updateOne(
      filter,
      updatedDoc,
      options
    );
    res.send(result);
  });





  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Lead Collector Website is Live Now");
});
app.listen(port, () => {
  console.log(`Lead Collector Website is Live Now ${port}`);
});
